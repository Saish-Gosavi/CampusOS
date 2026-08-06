import { DashboardRepository } from "../repository/dashboard.repository.js";

export class DashboardService {
  static async getSuperAdminDashboard() {
    const rawData = await DashboardRepository.getSuperAdminStats();

    return {
      stats: [
        { label: "Total Colleges", value: rawData.totalColleges, delta: "Active Campus Count", trend: "up" },
        { label: "Total Admins", value: rawData.adminsCount, delta: "Configured Staff", trend: "up" },
        { label: "Total Senior Admin", value: rawData.seniorAdminsCount, delta: "Platform Coordinators", trend: "up" },
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
}
