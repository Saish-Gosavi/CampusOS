import { prisma } from "../../config/prisma.js";

export class AuditLogService {
  /**
   * Log an activity to the audit database
   */
  static async logAction({
    userId,
    module,
    action,
    description,
    status = "Success",
    ipAddress = null,
    userAgent = null,
    oldData = null,
    newData = null,
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: userId ? Number(userId) : null,
          module,
          action,
          description,
          status,
          ipAddress,
          userAgent,
          oldData: oldData ? (typeof oldData === "string" ? oldData : JSON.stringify(oldData)) : null,
          newData: newData ? (typeof newData === "string" ? newData : JSON.stringify(newData)) : null,
        },
      });
    } catch (err) {
      console.error("[Audit Log Error] Failed to record audit event:", err.message);
    }
  }

  /**
   * Fetch paginated audit logs with search and filters
   */
  static async getLogs({
    page = 1,
    limit = 10,
    search = "",
    module = "",
    action = "",
    status = "",
    startDate = "",
    endDate = "",
  }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (module && module !== "All") {
      where.module = module;
    }

    if (action && action !== "All") {
      where.action = action;
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // include full end day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        { action: { contains: search } },
        { description: { contains: search } },
        { module: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: {
                select: { name: true },
              },
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Fetch stats for cards
    const [totalLogs, successCount, failedCount, criticalCount] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { status: "Success" } }),
      prisma.auditLog.count({ where: { status: "Failed" } }),
      prisma.auditLog.count({ where: { status: "Critical" } }),
    ]);

    return {
      logs: logs.map((log) => ({
        id: log.id,
        createdAt: log.createdAt,
        module: log.module,
        action: log.action,
        description: log.description,
        status: log.status,
        performedBy: log.user ? `${log.user.name || log.user.email} (${log.user.role?.name || "Admin"})` : "System",
        userEmail: log.user?.email || "system@campusos.com",
        userRole: log.user?.role?.name || "System",
        ipAddress: log.ipAddress || "127.0.0.1",
        userAgent: log.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        oldData: log.oldData,
        newData: log.newData,
      })),
      stats: {
        total: totalLogs,
        success: successCount,
        failed: failedCount,
        critical: criticalCount,
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }
}
