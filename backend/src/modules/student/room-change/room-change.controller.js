import { prisma } from "../../../config/prisma.js";

export const submitRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reason, requestedRoomId } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: "Reason is required." });
    }

    const student = await prisma.student.findUnique({
      where: { userId }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found." });
    }

    // Check if student has a pending request
    const existingPending = await prisma.roomChangeRequest.findFirst({
      where: { studentId: student.id, status: "Pending" }
    });

    if (existingPending) {
      return res.status(400).json({ success: false, message: "You already have a pending room change request." });
    }

    // Get current active allocation to find current room
    const currentAllocation = await prisma.allocation.findFirst({
      where: { studentId: student.id, status: "active" },
      include: { bed: { include: { room: true } } }
    });

    if (!currentAllocation) {
      return res.status(400).json({ success: false, message: "You don't have an active room allocation." });
    }

    const currentRoomId = currentAllocation.bed.roomId;

    const request = await prisma.roomChangeRequest.create({
      data: {
        studentId: student.id,
        currentRoomId,
        requestedRoomId: requestedRoomId ? parseInt(requestedRoomId) : null,
        reason
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        module: "RoomChange",
        action: "CREATE_ROOM_CHANGE_REQUEST",
        description: `Student ${student.fullName} submitted a room change request.`,
        newData: JSON.stringify({ reason })
      }
    });

    res.status(201).json({ success: true, message: "Room change request submitted successfully.", data: request });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const student = await prisma.student.findUnique({
      where: { userId }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found." });
    }

    const requests = await prisma.roomChangeRequest.findMany({
      where: { studentId: student.id },
      include: {
        currentRoom: true,
        requestedRoom: true,
        reviewedBy: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};
