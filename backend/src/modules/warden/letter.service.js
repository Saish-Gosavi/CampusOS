import { prisma } from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import { AuditLogService } from "../../core/audit/auditLog.service.js";

export class WardenLetterService {
  /**
   * Fetch all letter requests for Warden's hostel (or all requests for admin).
   */
  static async getWardenRequests(user) {
    const userRole = (user.role || "").toLowerCase();
    let hostelId = user.hostelId;

    if (userRole === "warden") {
      const warden = await prisma.warden.findUnique({ where: { userId: user.id } });
      if (warden?.hostelId) {
        hostelId = warden.hostelId;
      }
    }

    const where = hostelId ? { hostelId: Number(hostelId) } : {};

    return prisma.letterRequest.findMany({
      where,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            allocations: {
              where: { status: "active" },
              include: {
                bed: {
                  include: {
                    room: {
                      include: {
                        floor: {
                          include: {
                            block: {
                              include: { hostel: true }
                            }
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
        hostel: { select: { id: true, name: true, city: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
        allotmentLetter: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Approve a letter request.
   */
  static async approveRequest(requestId, user, reqMeta = {}) {
    const id = Number(requestId);
    const existing = await prisma.letterRequest.findUnique({
      where: { id },
      include: { student: { include: { user: { select: { name: true, email: true } } } } }
    });

    if (!existing) {
      throw new AppError("Letter request not found", 404);
    }

    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        status: "Approved",
        rejectionReason: null,
        approvedById: user.id
      },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        hostel: { select: { id: true, name: true } },
        allotmentLetter: true
      }
    });

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: "Approve Letter Request",
      description: `Warden approved allocation letter request #${id} for student ${existing.student?.fullName || existing.student?.user?.name}`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return updated;
  }

  /**
   * Reject a letter request with reason.
   */
  static async rejectRequest(requestId, user, rejectionReason, reqMeta = {}) {
    const id = Number(requestId);
    const existing = await prisma.letterRequest.findUnique({
      where: { id },
      include: { student: { include: { user: { select: { name: true, email: true } } } } }
    });

    if (!existing) {
      throw new AppError("Letter request not found", 404);
    }

    if (!rejectionReason || !rejectionReason.trim()) {
      throw new AppError("Rejection reason is required", 400);
    }

    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        status: "Rejected",
        rejectionReason: rejectionReason.trim(),
        approvedById: user.id
      },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        hostel: { select: { id: true, name: true } }
      }
    });

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: "Reject Letter Request",
      description: `Warden rejected allocation letter request #${id} for student ${existing.student?.fullName || existing.student?.user?.name}. Reason: ${rejectionReason}`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return updated;
  }

  /**
   * Generate Allotment Letter for an approved request.
   */
  static async generateLetter(requestId, user, reqMeta = {}) {
    const id = Number(requestId);
    const letterReq = await prisma.letterRequest.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            allocations: {
              where: { status: "active" },
              include: {
                bed: {
                  include: {
                    room: {
                      include: {
                        floor: {
                          include: {
                            block: {
                              include: { hostel: true }
                            }
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
        hostel: true,
        allotmentLetter: true
      }
    });

    if (!letterReq) {
      throw new AppError("Letter request not found", 404);
    }

    if (letterReq.status !== "Approved" && letterReq.status !== "Generated") {
      throw new AppError("Only approved requests can have a letter generated", 400);
    }

    // Check if letter already generated
    let letter = letterReq.allotmentLetter;
    const isRegenerate = Boolean(letter);

    if (!letter) {
      const year = new Date().getFullYear();
      const rand = Math.floor(10000 + Math.random() * 90000);
      const referenceNo = `AL-${year}-${rand}`;

      const activeAllocation = letterReq.student?.allocations?.[0];

      letter = await prisma.roomAllotmentLetter.create({
        data: {
          letterRequestId: letterReq.id,
          allocationId: activeAllocation?.id || null,
          referenceNo,
          issuedDate: new Date(),
          signedBy: user.name || "Warden Office",
          generatedById: user.id
        }
      });

      await prisma.letterRequest.update({
        where: { id },
        data: { status: "Generated" }
      });
    } else {
      // Re-stamp generated timestamp
      letter = await prisma.roomAllotmentLetter.update({
        where: { id: letter.id },
        data: {
          issuedDate: new Date(),
          generatedById: user.id
        }
      });
    }

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: isRegenerate ? "Regenerated Letter" : "Letter Generated",
      description: `${isRegenerate ? "Regenerated" : "Generated"} room allocation letter ref: ${letter.referenceNo} for student ${letterReq.student?.fullName || letterReq.student?.user?.name}`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return letter;
  }

  /**
   * Student submits letter request.
   */
  static async studentSubmitRequest(user, reqMeta = {}) {
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        allocations: {
          where: { status: "active" },
          include: { bed: { include: { room: { include: { floor: { include: { block: true } } } } } } }
        }
      }
    });

    if (!student) {
      throw new AppError("Student profile not found", 404);
    }

    // Check existing pending request
    const existingPending = await prisma.letterRequest.findFirst({
      where: {
        studentId: student.id,
        status: { in: ["Pending", "Approved"] }
      }
    });

    if (existingPending) {
      throw new AppError("You already have an active allocation letter request in process", 400);
    }

    const hostelId = student.allocations?.[0]?.bed?.room?.floor?.block?.hostelId || user.hostelId || null;

    const request = await prisma.letterRequest.create({
      data: {
        studentId: student.id,
        hostelId: hostelId ? Number(hostelId) : null,
        status: "Pending"
      },
      include: {
        hostel: { select: { name: true } }
      }
    });

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: "Request Submitted",
      description: `Student ${student.fullName} submitted a Hostel Allocation Letter Request`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return request;
  }

  /**
   * Student views their letter requests.
   */
  static async studentGetRequests(user) {
    const student = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return [];

    return prisma.letterRequest.findMany({
      where: { studentId: student.id },
      include: {
        hostel: { select: { id: true, name: true, city: true } },
        approvedBy: { select: { name: true } },
        allotmentLetter: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
