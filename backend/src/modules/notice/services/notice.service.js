import { NoticeRepository } from "../repository/notice.repository.js";
import { prisma } from "../../../config/prisma.js";

// Inline audit helper using Prisma AuditLog model
async function audit(userId, action, details) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: Number(userId),
        action,
        module: "Global Notice",
        description: typeof details === "string" ? details : JSON.stringify(details),
      },
    });
  } catch (err) {
    // Audit failure should NOT break the main operation
    console.error("[Notice Audit] Failed to write audit log:", err.message);
  }
}

export class NoticeService {
  static async getAll(user) {
    return NoticeRepository.findMany(user);
  }

  static async create(data, user) {
    // If not superadmin, restrict notice to their hostel
    const hostelId = user.role?.name === "superadmin" ? (data.hostelId || null) : user.hostelId;

    const notice = await NoticeRepository.create({
      title: data.title,
      content: data.content ?? "",
      isActive: data.isActive ?? true,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      createdById: Number(user.id),
      hostelId: hostelId ? Number(hostelId) : null,
      priority: data.priority || "General",
    });
    const action = data.scheduledAt ? "SCHEDULE_NOTICE" : "CREATE_NOTICE";
    await audit(user.id, action, {
      id: notice.id,
      title: notice.title,
      scheduledAt: data.scheduledAt ?? null,
      expiresAt: data.expiresAt ?? null,
    });
    return notice;
  }

  static async update(id, data, user) {
    const updateData = { ...data };
    if ("scheduledAt" in updateData) {
      updateData.scheduledAt = updateData.scheduledAt ? new Date(updateData.scheduledAt) : null;
    }
    if ("expiresAt" in updateData) {
      updateData.expiresAt = updateData.expiresAt ? new Date(updateData.expiresAt) : null;
    }
    const notice = await NoticeRepository.update(id, updateData, user);
    await audit(user.id, "UPDATE_NOTICE", { id, ...data });
    return notice;
  }

  static async remove(id, user) {
    await NoticeRepository.delete(id, user);
    await audit(user.id, "DELETE_NOTICE", { id });
  }
}
