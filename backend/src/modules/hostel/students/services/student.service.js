import bcrypt from "bcryptjs";
import { prisma } from "../../../../config/prisma.js";
import { StudentRepository } from "../repository/student.repository.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";
import AppError from "../../../../utils/AppError.js";

export class StudentService {
  static async getAll(user, query = {}) {
    let hostelId = user.hostelId;

    const userRole = (typeof user.role === "string" ? user.role : user.role?.name || "").toLowerCase();
    if (["admin", "senioradmin", "superadmin"].includes(userRole)) {
      if (query.hostelId) {
        hostelId = Number(query.hostelId);
      } else {
        hostelId = null;
      }
    }

    return StudentRepository.findAll(hostelId, query);
  }

  static async getById(id) {
    const student = await StudentRepository.findById(id);
    if (!student) {
      throw new AppError("Student not found", 404);
    }
    return student;
  }

  static async create(creator, data) {
    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedCollegeId = data.collegeId.trim();

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      throw new AppError("A user with this email address already exists.", 400);
    }

    // Check duplicate college ID
    const existingCollegeId = await StudentRepository.findByCollegeId(normalizedCollegeId);
    if (existingCollegeId) {
      throw new AppError("A student with this College ID already exists.", 400);
    }

    // Resolve student role
    let studentRole = await prisma.role.findUnique({ where: { name: "student" } });
    if (!studentRole) {
      studentRole = await prisma.role.create({
        data: { name: "student", description: "Hostel Student Resident" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const hostelId = data.hostelId || creator.hostelId;

    const student = await StudentRepository.create({
      fullName: data.fullName,
      email: normalizedEmail,
      phone: data.phone,
      collegeId: normalizedCollegeId,
      password: hashedPassword,
      hostelId,
      roleId: studentRole.id,
      status: data.status || "active",
    });

    await AuditLogService.logAction({
      userId: creator.id,
      module: "Students",
      action: "Create Student",
      description: `Created student resident ${student.fullName} (${student.collegeId})`,
      status: "Success",
    });

    return student;
  }

  static async update(creator, id, data) {
    const student = await StudentRepository.findById(id);
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    if (data.email && data.email.trim().toLowerCase() !== student.user.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email.trim().toLowerCase() },
      });
      if (emailTaken) {
        throw new AppError("A user with this email address already exists.", 400);
      }
    }

    if (data.collegeId && data.collegeId.trim() !== student.collegeId) {
      const collegeIdTaken = await StudentRepository.findByCollegeId(data.collegeId.trim());
      if (collegeIdTaken) {
        throw new AppError("A student with this College ID already exists.", 400);
      }
    }

    const updated = await StudentRepository.update(id, data);

    await AuditLogService.logAction({
      userId: creator.id,
      module: "Students",
      action: "Update Student",
      description: `Updated student resident details for ${updated.fullName} (ID: ${id})`,
      status: "Success",
    });

    return updated;
  }

  static async delete(creator, id) {
    const student = await StudentRepository.findById(id);
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const deleted = await StudentRepository.delete(id);

    await AuditLogService.logAction({
      userId: creator.id,
      module: "Students",
      action: "Delete Student",
      description: `Deleted student resident ${student.fullName} (${student.collegeId})`,
      status: "Success",
    });

    return deleted;
  }
}
