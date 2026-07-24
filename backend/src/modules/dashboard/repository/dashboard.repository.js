import { prisma } from "../../../config/prisma.js";

export class DashboardRepository {
  static async getSuperAdminStats() {
    const [
      hostelsCount,
      adminsCount,
      rolesCount,
      studentsCount,
      activeUsersCount,
      recentAuditLogs,
      recentHostels,
      hostelAdminsCount,
      libraryAdminsCount,
      inventoryAdminsCount
    ] = await Promise.all([
      prisma.hostel.count(),
      prisma.user.count({
        where: {
          role: {
            name: { in: ["admin", "superadmin", "warden", "librarian", "store"] },
          },
        },
      }),
      prisma.role.count(),
      prisma.student.count(),
      prisma.user.count({ where: { status: "active" } }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.hostel.findMany({
        take: 5,
        include: { blocks: true },
      }),
      prisma.user.count({ where: { role: { name: { in: ["admin", "warden"] } } } }),
      prisma.user.count({ where: { role: { name: "librarian" } } }),
      prisma.user.count({ where: { role: { name: "store" } } }),
    ]);

    // Calculate real monthly counts for the last 6 months from database timestamps
    const now = new Date();
    const monthlyUsage = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const monthName = monthStart.toLocaleString("default", { month: "short" });

      const [hostelAllocations, hostelComplaints, hostelLeaves, libraryIssues, libraryReservations, auditLogsCount] = await Promise.all([
        prisma.allocation.count({ where: { startDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.complaint.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.leaveRequest.count({ where: { startDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.bookIssue.count({ where: { issueDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.reservation.count({ where: { reservationDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.auditLog.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
      ]);

      monthlyUsage.push({
        month: monthName,
        Hostel: hostelAllocations + hostelComplaints + hostelLeaves,
        Library: libraryIssues + libraryReservations,
        Inventory: auditLogsCount,
      });
    }

    return {
      hostelsCount,
      adminsCount,
      rolesCount,
      studentsCount,
      activeUsersCount,
      recentAuditLogs,
      recentHostels,
      adminDistribution: [
        { name: "Hostel", value: hostelAdminsCount },
        { name: "Inventory", value: inventoryAdminsCount },
        { name: "Library", value: libraryAdminsCount }
      ],
      monthlyUsage
    };
  }
}
