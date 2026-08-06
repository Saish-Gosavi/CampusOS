import { prisma } from "../../../config/prisma.js";

export const getStatistics = async (req, res, next) => {
  try {
    const totalRequests = await prisma.roomChangeRequest.count();
    const pendingRequests = await prisma.roomChangeRequest.count({ where: { status: "Pending" } });
    const approvedRequests = await prisma.roomChangeRequest.count({ where: { status: "Approved" } });
    const rejectedRequests = await prisma.roomChangeRequest.count({ where: { status: "Rejected" } });
    const totalStudentsChanged = approvedRequests; // Each approved request is one student room change

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalStudentsChanged
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const { search = "", status = "" } = req.query;

    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (search) {
      where.student = {
        OR: [
          { fullName: { contains: search } },
          { collegeId: { contains: search } }
        ]
      };
    }

    const requests = await prisma.roomChangeRequest.findMany({
      where,
      include: {
        student: true,
        currentRoom: true,
        requestedRoom: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newRoomId, remarks } = req.body;
    const wardenId = req.user.id;

    if (!newRoomId) {
      return res.status(400).json({ success: false, message: "New room ID is required to approve." });
    }

    const request = await prisma.roomChangeRequest.findUnique({
      where: { id: parseInt(id) },
      include: { student: true, currentRoom: true }
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    if (request.status !== "Pending") {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    // Find new room and available beds
    const newRoom = await prisma.room.findUnique({
      where: { id: parseInt(newRoomId) },
      include: { beds: { include: { allocations: { where: { status: "active" } } } } }
    });
    
    if (!newRoom) {
      return res.status(404).json({ success: false, message: "New room not found" });
    }

    const availableBed = newRoom.beds.find(bed => bed.allocations.length === 0);
    if (!availableBed) {
      return res.status(400).json({ success: false, message: "New room has no available beds" });
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      // 1. Update the request status
      const updatedRequest = await prisma.roomChangeRequest.update({
        where: { id: parseInt(id) },
        data: {
          status: "Approved",
          remarks,
          requestedRoomId: newRoom.id,
          reviewedById: wardenId
        }
      });

      // 2. End current active allocation
      await prisma.allocation.updateMany({
        where: { studentId: request.studentId, status: "active" },
        data: { status: "completed", endDate: new Date() }
      });

      // 3. Create new allocation
      await prisma.allocation.create({
        data: {
          bedId: availableBed.id,
          studentId: request.studentId,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year assumption
          status: "active"
        }
      });

      // 4. Audit Log
      await prisma.auditLog.create({
        data: {
          userId: wardenId,
          module: "RoomChange",
          action: "APPROVE_ROOM_CHANGE",
          description: `Approved room change for student ${request.student.fullName}`,
          oldData: JSON.stringify({ room: request.currentRoom.number }),
          newData: JSON.stringify({ room: newRoom.number })
        }
      });

      return updatedRequest;
    });

    res.status(200).json({ success: true, message: "Room change request approved", data: transaction });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const wardenId = req.user.id;

    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: "Rejection reason is mandatory." });
    }

    const request = await prisma.roomChangeRequest.findUnique({
      where: { id: parseInt(id) },
      include: { student: true }
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    if (request.status !== "Pending") {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    const updatedRequest = await prisma.$transaction(async (prisma) => {
      const updated = await prisma.roomChangeRequest.update({
        where: { id: parseInt(id) },
        data: {
          status: "Rejected",
          rejectionReason,
          reviewedById: wardenId
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: wardenId,
          module: "RoomChange",
          action: "REJECT_ROOM_CHANGE",
          description: `Rejected room change for student ${request.student.fullName}`
        }
      });

      return updated;
    });

    res.status(200).json({ success: true, message: "Room change request rejected", data: updatedRequest });
  } catch (error) {
    next(error);
  }
};
