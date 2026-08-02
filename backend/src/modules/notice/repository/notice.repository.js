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

  findMany: async () => {
    // Automatically purge expired notices before retrieving
    await NoticeRepository.deleteExpired();
    return prisma.notice.findMany({
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

  update: (id, data) =>
    prisma.notice.update({ where: { id: Number(id) }, data }),

  delete: (id) => prisma.notice.delete({ where: { id: Number(id) } }),
};
