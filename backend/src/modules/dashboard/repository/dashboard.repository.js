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
      inventoryAdminsCount,
      hostelsByCity
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
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.hostel.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { blocks: true },
      }),
      prisma.user.count({ where: { role: { name: { in: ["admin", "warden"] } } } }),
      prisma.user.count({ where: { role: { name: "librarian" } } }),
      prisma.user.count({ where: { role: { name: "store" } } }),
      // Group hostels by city for the bar chart
      prisma.hostel.groupBy({
        by: ["city"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
    ]);

    // Calculate real monthly counts from actual database records
    const now = new Date();
    const monthlyUsage = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const monthName = monthStart.toLocaleString("default", { month: "short" });

      const [
        hostelLogs,
        hostelAllocations,
        hostelComplaints,
        hostelLeaves,
        libraryLogs,
        libraryIssues,
        libraryReservations,
        inventoryLogs,
        inventoryRequests
      ] = await Promise.all([
        prisma.auditLog.count({ where: { module: "Hostel", createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.allocation.count({ where: { startDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.complaint.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.leaveRequest.count({ where: { startDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.auditLog.count({ where: { module: "Library", createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.bookIssue.count({ where: { issueDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.reservation.count({ where: { reservationDate: { gte: monthStart, lte: monthEnd } } }),
        prisma.auditLog.count({ where: { module: "Inventory", createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.inventoryRequest.count({ where: { item: { id: { gt: 0 } } } }).catch(() => 0),
      ]);

      monthlyUsage.push({
        month: monthName,
        Hostel: hostelLogs + hostelAllocations + hostelComplaints + hostelLeaves,
        Library: libraryLogs + libraryIssues + libraryReservations,
        Inventory: inventoryLogs + inventoryRequests,
      });
    }

    // Build city distribution from real hostel data
    const cityDistribution = hostelsByCity
      .filter(h => h.city)
      .map(h => ({ name: h.city, value: h._count.id }));

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
      cityDistribution,
      monthlyUsage
    };
  }
}
