import { prisma } from "../../../../config/prisma.js";

const includeStudent = {
  student: {
    select: {
      id: true,
      fullName: true,
      phone: true,
      collegeId: true,
      allocations: {
        where: { status: "active" },
        take: 1,
        include: {
          bed: {
            include: {
              room: {
                include: {
                  floor: {
                    include: { block: { include: { hostel: { select: { name: true } } } } }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export class LeaveRepository {
  static async findAll({ status, leaveType, search, hostelId, page = 1, limit = 50 } = {}) {
    const where = {};
    if (status && status !== "all") where.status = status;
    if (leaveType && leaveType !== "All") where.leaveType = leaveType;
    if (search) {
      where.OR = [
        { reason: { contains: search } },
        { destination: { contains: search } },
        { student: { fullName: { contains: search } } },
        { student: { collegeId: { contains: search } } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [total, items] = await Promise.all([
      prisma.leaveRequest.count({ where }),
      prisma.leaveRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
        include: includeStudent
      })
    ]);
    return { total, page: Number(page), limit: Number(limit), items };
  }

  static async findById(id) {
    return prisma.leaveRequest.findUnique({
      where: { id: Number(id) },
      include: includeStudent
    });
  }

  static async create(data) {
    const { studentId, leaveType, reason, destination, contactPhone, parentContact, startDate, endDate } = data;
    return prisma.leaveRequest.create({
      data: {
        studentId: Number(studentId),
        leaveType: leaveType || "Personal",
        reason,
        destination: destination || null,
        contactPhone: contactPhone || null,
        parentContact: parentContact || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "pending"
      },
      include: includeStudent
    });
  }

  static async updateStatus(id, { status, remarks, reviewedBy }) {
    return prisma.leaveRequest.update({
      where: { id: Number(id) },
      data: {
        status,
        remarks: remarks || null,
        reviewedBy: reviewedBy || "Admin",
        reviewedAt: new Date()
      },
      include: includeStudent
    });
  }

  static async update(id, data) {
    const { leaveType, reason, destination, contactPhone, parentContact, startDate, endDate } = data;
    return prisma.leaveRequest.update({
      where: { id: Number(id) },
      data: {
        ...(leaveType && { leaveType }),
        ...(reason && { reason }),
        ...(destination !== undefined && { destination }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(parentContact !== undefined && { parentContact }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
      include: includeStudent
    });
  }

  static async delete(id) {
    return prisma.leaveRequest.delete({ where: { id: Number(id) } });
  }

  static async getStats(hostelId = null) {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.leaveRequest.count(),
      prisma.leaveRequest.count({ where: { status: "pending" } }),
      prisma.leaveRequest.count({ where: { status: "approved" } }),
      prisma.leaveRequest.count({ where: { status: "rejected" } }),
    ]);
    return { total, pending, approved, rejected };
  }
}
