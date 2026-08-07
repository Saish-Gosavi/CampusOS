import { prisma } from "../../../config/prisma.js";

export const LettersRepository = {
  findForStudent: async (studentId) => {
    return prisma.occupancyLetterRequest.findMany({
      where: { studentId: Number(studentId) },
      orderBy: { createdAt: "desc" },
      include: {
        warden: { select: { fullName: true } },
      },
    });
  },

  findForHostel: async (hostelId) => {
    return prisma.occupancyLetterRequest.findMany({
      where: {
        student: {
          allocations: {
            some: {
              bed: {
                room: {
                  floor: {
                    block: {
                      hostelId: Number(hostelId),
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { fullName: true, collegeId: true } },
        warden: { select: { fullName: true } },
      },
    });
  },

  findById: async (id) => {
    return prisma.occupancyLetterRequest.findUnique({
      where: { id: Number(id) },
      include: {
        student: { select: { fullName: true, collegeId: true, userId: true } },
      },
    });
  },

  create: async (studentId) => {
    return prisma.occupancyLetterRequest.create({
      data: {
        studentId: Number(studentId),
        status: "pending",
      },
    });
  },

  approve: async (id, wardenId, referenceNo) => {
    return prisma.occupancyLetterRequest.update({
      where: { id: Number(id) },
      data: {
        status: "approved",
        issuedDate: new Date(),
        referenceNo,
        wardenId: Number(wardenId),
      },
    });
  },
};
