import { ComplaintRepository } from "../repository/complaint.repository.js";
import { prisma } from "../../../../config/prisma.js";

export class ComplaintService {
  static async getAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.priority) where.priority = filters.priority;
    if (filters.studentId) where.studentId = Number(filters.studentId);
    return ComplaintRepository.findAll(where);
  }

  static async getById(id) {
    return ComplaintRepository.findById(id);
  }

  static async create(data, currentUser = null) {
    let studentId = data.studentId ? Number(data.studentId) : null;

    if (!studentId && currentUser) {
      const student = await prisma.student.findUnique({
        where: { userId: currentUser.id },
      });
      if (student) {
        studentId = student.id;
      }
    }

    if (!studentId) {
      const firstStudent = await prisma.student.findFirst();
      if (firstStudent) {
        studentId = firstStudent.id;
      } else {
        throw new Error("No student record found to associate with complaint.");
      }
    }

    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority || "medium",
      status: data.status || "open",
      studentId,
    };

    return ComplaintRepository.create(payload);
  }

  static async update(id, data) {
    const payload = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.category !== undefined) payload.category = data.category;
    if (data.priority !== undefined) payload.priority = data.priority;
    if (data.status !== undefined) payload.status = data.status;
    if (data.rejectionReason !== undefined) payload.rejectionReason = data.rejectionReason;
    if (data.resolution !== undefined) payload.resolution = data.resolution;

    return ComplaintRepository.update(id, payload);
  }

  static async delete(id) {
    return ComplaintRepository.delete(id);
  }
}

