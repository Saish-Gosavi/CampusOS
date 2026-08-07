import { prisma } from "../../../config/prisma.js";

export class UsersRepository {
  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        studentProfile: {
          include: {
            allocations: {
              include: {
                bed: {
                  include: {
                    room: {
                      include: {
                        floor: {
                          include: {
                            block: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        wardenProfile: {
          include: {
            hostel: true
          }
        },
        securityProfile: true,
        hostel: true,
      },
    });
  }

  static async updateProfile(id, data) {
    const { name, email, phone, ...rest } = data;
    const userUpdate = {};
    if (name !== undefined) userUpdate.name = name;
    if (email !== undefined) userUpdate.email = email;
    if (Object.keys(rest).length > 0) {
      Object.assign(userUpdate, rest);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: userUpdate,
      include: {
        role: true,
        studentProfile: true,
        wardenProfile: { include: { hostel: true } },
        securityProfile: true,
        hostel: true,
      },
    });

    if (name || phone) {
      if (updatedUser.wardenProfile) {
        await prisma.warden.update({
          where: { userId: id },
          data: {
            ...(name && { fullName: name }),
            ...(phone && { phone }),
          },
        });
      }
      if (updatedUser.studentProfile) {
        await prisma.student.update({
          where: { userId: id },
          data: {
            ...(name && { fullName: name }),
            ...(phone && { phone }),
          },
        });
      }
      if (updatedUser.securityProfile) {
        await prisma.securityStaff.update({
          where: { userId: id },
          data: {
            ...(name && { fullName: name }),
            ...(phone && { phone }),
          },
        });
      }
    }

    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        studentProfile: {
          include: {
            allocations: {
              include: {
                bed: {
                  include: {
                    room: {
                      include: {
                        floor: {
                          include: {
                            block: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        wardenProfile: { include: { hostel: true } },
        securityProfile: true,
        hostel: true,
      },
    });
  }

  static async findAll() {
    return prisma.user.findMany({
      include: { role: true, studentProfile: true },
    });
  }

  static async create(data) {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  }

  static async delete(id) {
    const userId = Number(id);
    if (!userId || isNaN(userId)) return null;

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return null;

    await prisma.$transaction([
      prisma.student.deleteMany({ where: { userId } }),
      prisma.warden.deleteMany({ where: { userId } }),
      prisma.securityStaff.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.auditLog.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return existing;
  }
}
