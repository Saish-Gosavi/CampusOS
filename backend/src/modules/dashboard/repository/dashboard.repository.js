import { prisma } from "../../../config/prisma.js";

export class DashboardRepository {
  static async getSuperAdminStats() {
    const [
      hostelsCount,
      collegesCount,
      adminsCount,
      rolesCount,
      studentsCount,
      activeUsersCount,
      recentAuditLogs,
      recentHostels,
      hostelAdminsCount,
      libraryAdminsCount,
      inventoryAdminsCount,
      allHostels,
      allColleges,
      studentYearsGroup
    ] = await Promise.all([
      prisma.hostel.count().catch(() => 0),
      prisma.college.count().catch(() => 0),
      prisma.user.count({
        where: {
          role: {
            name: { in: ["admin", "superadmin", "warden", "security", "librarian", "store"] },
          },
        },
      }).catch(() => 0),
      prisma.role.count().catch(() => 0),
      prisma.student.count().catch(() => 0),
      prisma.user.count({ where: { status: "active" } }).catch(() => 0),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }).catch(() => []),
      prisma.hostel.findMany({
        take: 5,
        include: { blocks: true },
      }).catch(() => []),
      prisma.user.count({ where: { role: { name: { in: ["admin", "warden"] } } } }).catch(() => 0),
      prisma.user.count({ where: { role: { name: "librarian" } } }).catch(() => 0),
      prisma.user.count({ where: { role: { name: "store" } } }).catch(() => 0),
      prisma.hostel.findMany({ select: { name: true, city: true, address: true } }).catch(() => []),
      prisma.college.findMany({ select: { name: true, city: true, address: true } }).catch(() => []),
      prisma.student.groupBy({
        by: ["academicYear"],
        _count: { id: true },
      }).catch(() => [])
    ]);

    const totalColleges = hostelsCount + collegesCount;

    // Calculate real Colleges by City distribution from all hostels and colleges in database
    const cityMap = {};
    const allLocations = [...allHostels, ...allColleges];
    allLocations.forEach((loc) => {
      let cityName = loc.city?.trim() || loc.address?.split(",")[0]?.trim() || "Campus Main";
      cityMap[cityName] = (cityMap[cityName] || 0) + 1;
    });

    const cityDistribution = Object.keys(cityMap).map((city) => ({
      name: city,
      value: cityMap[city],
    })).sort((a, b) => b.value - a.value);

    // Calculate real Student Distribution by Year
    const studentDistribution = (studentYearsGroup || []).map((sg) => ({
      name: sg.academicYear ? sg.academicYear : "General",
      value: sg._count?.id || 0,
    }));

    // Calculate real monthly counts for the last 6 months from database timestamps
    const now = new Date();
    const monthlyUsage = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const monthName = monthStart.toLocaleString("default", { month: "short" });

      const [
        hostelAllocations,
        hostelComplaints,
        hostelLeaves,
        hostelAuditLogs,
        libraryIssues,
        libraryReservations,
        libraryAuditLogs,
        inventoryRequests,
        inventoryAuditLogs
      ] = await Promise.all([
        prisma.allocation.count({ where: { startDate: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.complaint.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.leaveRequest.count({ where: { startDate: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.auditLog.count({ where: { module: "Hostel", createdAt: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.bookIssue.count({ where: { issueDate: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.reservation.count({ where: { reservationDate: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.auditLog.count({ where: { module: "Library", createdAt: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.inventoryRequest.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
        prisma.auditLog.count({ where: { module: "Inventory", createdAt: { gte: monthStart, lte: monthEnd } } }).catch(() => 0),
      ]);

      monthlyUsage.push({
        month: monthName,
        Hostel: hostelAllocations + hostelComplaints + hostelLeaves + hostelAuditLogs,
        Library: libraryIssues + libraryReservations + libraryAuditLogs,
        Inventory: inventoryRequests + inventoryAuditLogs,
      });
    }

    return {
      totalColleges,
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
      monthlyUsage,
      cityDistribution,
      studentDistribution
    };
  }

  static async getHostelAdminStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      studentsCount,
      roomsCount,
      occupiedRoomsCount,
      pendingComplaints,
      pendingLeaves,
      visitorsToday,
      blocks,
      complaints,
      leaves,
      recentLeaves,
      recentAuditLogs,
      recentStudents
    ] = await Promise.all([
      prisma.student.count().catch(() => 0),
      prisma.room.count().catch(() => 0),
      prisma.room.count({ where: { status: "occupied" } }).catch(() => 0),
      prisma.complaint.count({ where: { status: { in: ["open", "pending"] } } }).catch(() => 0),
      prisma.leaveRequest.count({ where: { status: "pending" } }).catch(() => 0),
      prisma.visitor.count({ where: { checkIn: { gte: today } } }).catch(() => 0),
      prisma.block.findMany({
        include: {
          rooms: {
            select: { capacity: true, status: true, beds: { where: { status: "occupied" } } }
          }
        }
      }).catch(() => []),
      prisma.complaint.groupBy({
        by: ["status"],
        _count: { id: true }
      }).catch(() => []),
      prisma.leaveRequest.groupBy({
        by: ["status"],
        _count: { id: true }
      }).catch(() => []),
      prisma.leaveRequest.findMany({
        take: 5,
        orderBy: { id: "desc" },
        include: { 
          student: { 
            select: { 
              fullName: true, 
              id: true,
              allocations: {
                where: { status: "active" },
                take: 1,
                include: { bed: { include: { room: { select: { number: true } } } } }
              }
            } 
          } 
        }
      }).catch(() => []),
      prisma.auditLog.findMany({
        where: { module: "Hostel" },
        take: 5,
        orderBy: { id: "desc" },
        include: { user: { select: { name: true } } }
      }).catch(() => []),
      prisma.student.findMany({
        take: 5,
        orderBy: { id: "desc" },
        include: {
          allocations: {
            where: { status: "active" },
            take: 1,
            include: { bed: { include: { room: { select: { number: true } } } } }
          }
        }
      }).catch(() => []),
    ]);

    // Calculate Fees (Mocking fee total for now, or fetch from a Fee model if it exists)
    const feeCollection = 1980000; // Mock 19.8L as requested in design

    return {
      studentsCount,
      roomsCount,
      occupiedRoomsCount,
      availableRoomsCount: roomsCount - occupiedRoomsCount,
      pendingComplaints,
      pendingLeaves,
      visitorsToday,
      feeCollection,
      blocks,
      complaintDistribution: complaints,
      leaveDistribution: leaves,
      recentLeaves,
      recentAuditLogs,
      recentStudents
    };
  }
}
