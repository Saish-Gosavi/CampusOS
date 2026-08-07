import { DashboardRepository } from "../repository/dashboard.repository.js";

export class DashboardService {
  static async getSuperAdminDashboard() {
    const rawData = await DashboardRepository.getSuperAdminStats();

    return {
      stats: [
        { label: "Total Colleges", value: rawData.totalColleges, delta: "Active Campus Count", trend: "up" },
        { label: "Total Senior Admins", value: rawData.adminsCount, delta: "Configured Coordinators", trend: "up" },
        { label: "Total Hostel Admins", value: rawData.hostelAdminsCount, delta: "Campus Staff", trend: "up" },
        { label: "Total Students", value: rawData.studentsCount, delta: "Enrolled", trend: "up" },
        { label: "Active Users (24h)", value: rawData.activeUsersCount, delta: "Operational Accounts", trend: "up" },
        { label: "Platform Uptime", value: "99.99%", delta: "Last 30 days", trend: "up" },
      ],
      adminDistribution: rawData.adminDistribution,
      moduleUsage: rawData.monthlyUsage,
      cityDistribution: rawData.cityDistribution,
      studentDistribution: rawData.studentDistribution,
      recentHostels: rawData.recentHostels,
      recentActivity: rawData.recentAuditLogs,
    };
  }

  static async getHostelAdminDashboard() {
    const rawData = await DashboardRepository.getHostelAdminStats();

    // Map blocks for chart
    const occupancyByBlock = rawData.blocks.map(block => {
      let capacity = 0;
      let occupied = 0;
      block.rooms.forEach(room => {
        capacity += room.capacity || 0;
        occupied += room.beds?.length || 0;
      });
      return {
        block: block.name,
        capacity,
        occupied
      };
    });

    // Map complaint distribution
    const complaintColors = {
      open: "#EF4444",
      pending: "#EAB308",
      resolved: "#22C55E",
      closed: "#6B7280"
    };
    const complaintOverview = rawData.complaintDistribution.map(c => ({
      name: c.status.charAt(0).toUpperCase() + c.status.slice(1),
      value: c._count.id,
      color: complaintColors[c.status] || "#94A3B8"
    }));

    // Map leave distribution
    const leaveColors = {
      pending: "#EAB308",
      approved: "#22C55E",
      rejected: "#EF4444"
    };
    const leaveOverview = rawData.leaveDistribution.map(l => ({
      name: l.status.charAt(0).toUpperCase() + l.status.slice(1),
      value: l._count.id,
      color: leaveColors[l.status] || "#94A3B8"
    }));

    // Map furniture distribution
    const furnitureColors = {
      good: "#22C55E",
      damaged: "#EF4444",
      "under-maintenance": "#EAB308"
    };
    const furnitureStatus = (rawData.furnitureStats || []).map(f => ({
      name: f.status.charAt(0).toUpperCase() + f.status.slice(1).replace("-", " "),
      value: f._count.id,
      color: furnitureColors[f.status] || "#6B7280"
    }));

    // Map visitor trend (group by day of week)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const visitorTrendMap = {};
    daysOfWeek.forEach(d => visitorTrendMap[d] = { day: d, total: 0, approved: 0 });
    
    (rawData.recentVisitors || []).forEach(v => {
      const d = new Date(v.createdAt).getDay();
      const dayName = daysOfWeek[d];
      visitorTrendMap[dayName].total += 1;
      if (v.status === "Approved" || v.status === "Checked-In" || v.status === "Checked-Out") {
        visitorTrendMap[dayName].approved += 1;
      }
    });
    // Shift array to start with Monday for standard chart presentation
    const visitorTrend = [
      visitorTrendMap["Mon"], visitorTrendMap["Tue"], visitorTrendMap["Wed"], 
      visitorTrendMap["Thu"], visitorTrendMap["Fri"], visitorTrendMap["Sat"], visitorTrendMap["Sun"]
    ];

    return {
      stats: {
        totalStudents: rawData.studentsCount,
        totalRooms: rawData.roomsCount,
        occupiedRooms: rawData.occupiedRoomsCount,
        availableRooms: rawData.availableRoomsCount,
        pendingComplaints: rawData.pendingComplaints,
        pendingLeaves: rawData.pendingLeaves,
        visitorsToday: rawData.visitorsToday,
        feeCollection: rawData.feeCollection
      },
      charts: {
        occupancyByBlock,
        complaintOverview,
        leaveOverview,
        furnitureStatus,
        visitorTrend
      },
      lists: {
        recentLeaves: rawData.recentLeaves.map(l => ({
          id: l.id,
          studentName: l.student?.fullName || "Unknown",
          room: l.student?.allocations?.[0]?.bed?.room ? l.student.allocations[0].bed.room.number : "Unallocated",
          date: `${new Date(l.startDate).toISOString().split('T')[0]} → ${new Date(l.endDate).toISOString().split('T')[0]}`,
          reason: l.reason,
          status: l.status
        })),
        recentActivity: rawData.recentAuditLogs.map(a => ({
          id: a.id,
          action: a.action,
          description: a.description,
          time: a.createdAt,
          user: a.user?.name || "System"
        })),
        recentStudents: rawData.recentStudents.map(s => ({
          id: s.id,
          name: s.fullName,
          program: s.collegeId,
          room: s.allocations?.[0]?.bed?.room ? s.allocations[0].bed.room.number : "Unallocated",
          status: s.status || "Active"
        }))
      }
    };
  }
}
