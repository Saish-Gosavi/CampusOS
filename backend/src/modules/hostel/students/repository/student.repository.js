import { prisma } from "../../../../config/prisma.js";

export class StudentRepository {
  static async findAll(hostelId, { search, status, department } = {}) {
    const where = {};

    if (hostelId) {
      where.user = {
        hostelId: Number(hostelId),
      };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q } },
        { collegeId: { contains: q } },
        { phone: { contains: q } },
        { user: { email: { contains: q } } },
      ];
    }

    if (status && status !== "All") {
      where.user = {
        ...where.user,
        status: status.toLowerCase(),
      };
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            hostelId: true,
            hostel: true,
          },
        },
        allocations: {
          include: {
            bed: {
              include: {
                room: {
                  include: {
                    floor: {
                      include: {
                        block: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return students;
  }

  static async findById(id) {
    const studentId = Number(id);
    if (!studentId || isNaN(studentId)) return null;

    return prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            hostelId: true,
            hostel: true,
          },
        },
        allocations: {
          include: {
            bed: {
              include: {
                room: {
                  include: {
                    floor: {
                      include: {
                        block: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        leaves: true,
        complaints: true,
      },
    });
  }

  static async findByCollegeId(collegeId) {
    if (!collegeId) return null;
    return prisma.student.findUnique({
      where: { collegeId },
    });
  }

  static async create({ fullName, email, phone, collegeId, password, hostelId, roleId, status = "active" }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password,
          name: fullName,
          roleId,
          hostelId: hostelId ? Number(hostelId) : null,
          status,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          fullName,
          phone,
          collegeId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              status: true,
              hostelId: true,
              hostel: true,
            },
          },
        },
      });

      return student;
    });
  }

  static async update(id, { fullName, phone, email, status, collegeId }) {
    const studentId = Number(id);
    const existing = await this.findById(studentId);
    if (!existing) return null;

    return prisma.$transaction(async (tx) => {
      if (email || status || fullName) {
        await tx.user.update({
          where: { id: existing.userId },
          data: {
            ...(email && { email }),
            ...(status && { status: status.toLowerCase() }),
            ...(fullName && { name: fullName }),
          },
        });
      }

      const updatedStudent = await tx.student.update({
        where: { id: studentId },
        data: {
          ...(fullName && { fullName }),
          ...(phone && { phone }),
          ...(collegeId && { collegeId }),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              status: true,
              hostelId: true,
              hostel: true,
            },
          },
          allocations: {
            include: {
              bed: {
                include: {
                  room: {
                    include: {
                      floor: {
                        include: {
                          block: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return updatedStudent;
    });
  }

  static async delete(id) {
    const studentId = Number(id);
    const existing = await this.findById(studentId);
    if (!existing) return null;

    await prisma.$transaction([
      prisma.allocation.deleteMany({ where: { studentId } }),
      prisma.leaveRequest.deleteMany({ where: { studentId } }),
      prisma.complaint.deleteMany({ where: { studentId } }),
      prisma.fee.deleteMany({ where: { studentId } }),
      prisma.studentDocument.deleteMany({ where: { studentId } }),
      prisma.student.delete({ where: { id: studentId } }),
      prisma.user.delete({ where: { id: existing.userId } }),
    ]);

    return existing;
  }
}
