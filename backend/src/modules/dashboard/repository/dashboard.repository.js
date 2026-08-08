import { prisma } from "../../../config/prisma.js";

export class DashboardRepository {
  static async getSuperAdminStats() {
    const [
      hostelsCount,
      collegesCount,
      adminsCount,
      seniorAdminsCount,
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
            name: "senioradmin",
          },
        },
      }).catch(() => 0),
      prisma.user.count({
        where: {
          role: {
            name: "senioradmin",
          },
        },
      }).catch(() => 0),
      prisma.student.count().catch(() => 0),
      prisma.user.count({ where: { status: "active" } }).catch(() => 0),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { include: { role: true } } },
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
      seniorAdminsCount,
      studentsCount,
      activeUsersCount,
      recentAuditLogs,
      recentHostels,
      hostelAdminsCount,
      libraryAdminsCount,
      inventoryAdminsCount,
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
      recentStudents,
      recentVisitors,
      furnitureStats
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
      prisma.visitor.findMany({
        where: { createdAt: { gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) } },
        select: { createdAt: true, status: true }
      }).catch(() => []),
      prisma.furniture.groupBy({
        by: ["status"],
        _count: { id: true }
      }).catch(() => [])
    ]);

    const feeCollection = 0; // Removed mock data

    return {
      studentsCount,
      roomsCount,
      occupiedRoomsCount,
      availableRoomsCount: roomsCount - occupiedRoomsCount,
      pendingComplaints,
      pendingLeaves,
      visitorsToday,
      blocks,
      complaintDistribution: complaints,
      leaveDistribution: leaves,
      recentLeaves,
      recentAuditLogs,
      recentStudents,
      recentVisitors,
      furnitureStats
    };
  }

  static async getWardenStats(userId = null, hostelIdFilter = null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Get warden info if userId is provided
    let wardenProfile = null;
    if (userId) {
      wardenProfile = await prisma.warden.findUnique({
        where: { userId: Number(userId) },
        include: { hostel: { include: { blocks: true } } }
      }).catch(() => null);
    }

    const targetHostelId = hostelIdFilter || wardenProfile?.hostelId || null;
    const hostelWhere = targetHostelId ? { hostelId: Number(targetHostelId) } : {};
    const blockWhere = targetHostelId ? { block: { hostelId: Number(targetHostelId) } } : {};

    const [
      studentsCount,
      totalRoomsCount,
      occupiedRoomsCount,
      pendingLeavesCount,
      activeComplaintsCount,
      visitorsTodayCount,
      furnitureMaintenanceCount,
      noticesCount,
      blocksData,
      complaintsGroupBy,
      leavesGroupBy,
      recentLeaves,
      recentComplaints,
      recentVisitors,
      auditLogs
    ] = await Promise.all([
      prisma.student.count({
        where: targetHostelId ? {
          allocations: {
            some: {
              status: "active",
              bed: { room: { floor: { block: { hostelId: Number(targetHostelId) } } } }
            }
          }
        } : {}
      }).catch(() => 0),

      prisma.room.count({
        where: targetHostelId ? { floor: { block: { hostelId: Number(targetHostelId) } } } : {}
      }).catch(() => 0),

      prisma.room.count({
        where: {
          ...(targetHostelId ? { floor: { block: { hostelId: Number(targetHostelId) } } } : {}),
          beds: { some: { allocations: { some: { status: "active" } } } }
        }
      }).catch(() => 0),

      prisma.leaveRequest.count({ where: { status: "pending" } }).catch(() => 0),

      prisma.complaint.count({
        where: { status: { in: ["pending", "open", "in_progress"] } }
      }).catch(() => 0),

      prisma.visitor.count({
        where: { checkIn: { gte: today } }
      }).catch(() => 0),

      prisma.furniture.count({
        where: { status: { in: ["damaged", "maintenance", "Repair"] } }
      }).catch(() => 0),

      prisma.notice.count().catch(() => 0),

      prisma.block.findMany({
        where: hostelWhere,
        include: {
          floors: {
            include: {
              rooms: {
                include: { beds: { include: { allocations: { where: { status: "active" } } } } }
              }
            }
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
              id: true,
              fullName: true,
              allocations: {
                where: { status: "active" },
                take: 1,
                include: { bed: { include: { room: { select: { number: true } } } } }
              }
            }
          }
        }
      }).catch(() => []),

      prisma.complaint.findMany({
        take: 5,
        orderBy: { id: "desc" },
        include: {
          student: { select: { fullName: true } }
        }
      }).catch(() => []),

      prisma.visitor.findMany({
        take: 5,
        orderBy: { id: "desc" },
        include: {
          student: { select: { fullName: true } }
        }
      }).catch(() => []),

      prisma.auditLog.findMany({
        take: 5,
        orderBy: { id: "desc" },
        include: { user: { select: { name: true } } }
      }).catch(() => [])
    ]);

    // Format occupancy by block for chart
    const occupancyByBlock = blocksData.map((b) => {
      let capacity = 0;
      let occupied = 0;
      (b.floors || []).forEach((f) => {
        (f.rooms || []).forEach((r) => {
          capacity += r.capacity || 0;
          (r.beds || []).forEach((bed) => {
            if (bed.allocations && bed.allocations.length > 0) occupied += 1;
          });
        });
      });
      return { name: b.name, capacity, occupied };
    });

    return {
      warden: wardenProfile ? {
        id: wardenProfile.id,
        fullName: wardenProfile.fullName,
        shift: wardenProfile.shift,
        hostelName: wardenProfile.hostel?.name || "Hostel Main",
        blocks: wardenProfile.hostel?.blocks?.map(b => b.name) || ["Block A", "Block B"]
      } : {
        fullName: "Warden",
        shift: "Day",
        hostelName: "Campus Hostel",
        blocks: ["Block A", "Block B"]
      },
      stats: {
        totalStudents: studentsCount,
        occupiedRooms: occupiedRoomsCount,
        availableRooms: Math.max(0, totalRoomsCount - occupiedRoomsCount),
        pendingLeaves: pendingLeavesCount,
        activeComplaints: activeComplaintsCount,
        visitorsToday: visitorsTodayCount,
        furnitureMaintenance: furnitureMaintenanceCount,
        noticesPublished: noticesCount
      },
      occupancyByBlock,
      complaintOverview: complaintsGroupBy.map(c => ({
        name: c.status.charAt(0).toUpperCase() + c.status.slice(1),
        value: c._count.id
      })),
      leaveRequestOverview: leavesGroupBy.map(l => ({
        name: l.status.charAt(0).toUpperCase() + l.status.slice(1),
        value: l._count.id
      })),
      recentLeaves,
      recentComplaints,
      recentVisitors,
      recentActivities: auditLogs.map(a => ({
        id: a.id,
        user: a.user?.name || "System",
        action: a.action,
        description: a.description,
        time: a.createdAt
      }))
    };
  }
}
