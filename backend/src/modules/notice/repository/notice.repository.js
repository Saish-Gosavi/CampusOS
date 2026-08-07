import { prisma } from "../../../config/prisma.js";

export const NoticeRepository = {
  deleteExpired: async () => {
    try {
      await prisma.notice.deleteMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
    } catch (err) {
      console.error("[Notice Cleanup] Failed to auto-delete expired notices:", err.message);
    }
  },

  findMany: async (user) => {
    // Automatically purge expired notices before retrieving
    await NoticeRepository.deleteExpired();
    
    let whereClause = {};
    if (user?.role?.name !== "superadmin") {
      whereClause = {
        OR: [
          { hostelId: null }, // Global notices
          { hostelId: user.hostelId } // Hostel specific notices
        ]
      };
    }
    
    return prisma.notice.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
    });
  },

  findById: (id) =>
    prisma.notice.findUnique({
      where: { id: Number(id) },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
    }),

  create: (data) => prisma.notice.create({ data }),

  update: async (id, data, user) => {
    if (user?.role?.name !== "superadmin") {
      const existing = await prisma.notice.findUnique({ where: { id: Number(id) } });
      if (existing.hostelId !== user.hostelId) {
        throw new Error("Unauthorized to update this notice");
      }
    }
    return prisma.notice.update({ where: { id: Number(id) }, data });
  },

  delete: async (id, user) => {
    if (user?.role?.name !== "superadmin") {
      const existing = await prisma.notice.findUnique({ where: { id: Number(id) } });
      if (existing.hostelId !== user.hostelId) {
        throw new Error("Unauthorized to delete this notice");
      }
    }
    return prisma.notice.delete({ where: { id: Number(id) } });
  },
};
