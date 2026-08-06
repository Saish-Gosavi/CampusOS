import { prisma } from "../../../config/prisma.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class AdminReportsService {
  /**
   * GET /api/admin/reports
   * Retrieves comprehensive metrics & detailed records for all 12 hostel modules.
   */
  static async getSummaryStats(query = {}) {
    const { module = "Overview", startDate, endDate, search, page = 1, limit = 20 } = query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Date filter helper
    const dateWhere = {};
    if (startDate) dateWhere.gte = new Date(startDate);
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      dateWhere.lte = e;
    }

    // 1. Overview counts across all models
    const [
      totalStudents,
      totalBeds,
      occupiedBeds,
      totalBlocks,
      totalRooms,
      pendingAdmissions,
      totalAllocationLetters,
      totalStaff,
      totalFeesCollected,
      pendingFeesCount,
      totalLeaves,
      pendingLeavesCount,
      totalVisitors,
      activeVisitorsCount,
      todayAttendanceCount,
      totalComplaints,
      openComplaintsCount,
      totalNotices,
      activeNoticesCount,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.bed.count(),
      prisma.allocation.count({ where: { status: "active" } }),
      prisma.block.count(),
      prisma.room.count(),
      prisma.user.count({ where: { role: { name: "STUDENT" }, status: "pending" } }),
      prisma.roomAllotmentLetter.count(),
      prisma.user.count({ where: { role: { name: { in: ["WARDEN", "SECURITY", "HOSTEL_ADMIN", "ADMIN"] } } } }),
      prisma.fee.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
      prisma.fee.count({ where: { status: "unpaid" } }),
      prisma.leaveRequest.count(),
      prisma.leaveRequest.count({ where: { status: "pending" } }),
      prisma.visitor.count(),
      prisma.visitor.count({ where: { status: { in: ["Approved", "Checked-In"] } } }),
      prisma.attendance.count(),
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: "open" } }),
      prisma.notice.count(),
      prisma.notice.count({ where: { isActive: true } }),
    ]);

    // 2. Fetch specific module detailed records & counts
    let moduleRecords = [];
    let totalRecords = 0;
    let moduleExtraStats = {};

    switch (module) {
      case "Hostel": {
        totalRecords = await prisma.room.count();
        moduleRecords = await prisma.room.findMany({
          include: {
            floor: { include: { block: true } },
            beds: { include: { allocations: { where: { status: "active" }, include: { student: true } } } },
            furniture: true,
          },
          skip,
          take: limitNum,
          orderBy: { number: "asc" },
        });

        const furnitureGood = await prisma.furniture.count({ where: { status: "good" } });
        const furnitureDamaged = await prisma.furniture.count({ where: { status: "damaged" } });
        moduleExtraStats = {
          totalBlocks,
          totalRooms,
          totalBeds,
          occupiedBeds,
          vacantBeds: Math.max(0, totalBeds - occupiedBeds),
          furnitureGood,
          furnitureDamaged,
        };
        break;
      }

      case "Admissions": {
        const where = { role: { name: "STUDENT" } };
        if (search) {
          where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
          ];
        }
        totalRecords = await prisma.user.count({ where });
        moduleRecords = await prisma.user.findMany({
          where,
          include: { studentProfile: true, role: true },
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        });

        const activeCount = await prisma.user.count({ where: { role: { name: "STUDENT" }, status: "active" } });
        const pendingCount = await prisma.user.count({ where: { role: { name: "STUDENT" }, status: "pending" } });
        moduleExtraStats = { totalAdmissions: totalRecords, activeCount, pendingCount };
        break;
      }

      case "AllocationLetters": {
        const where = {};
        if (Object.keys(dateWhere).length) where.createdAt = dateWhere;

        totalRecords = await prisma.roomAllotmentLetter.count({ where });
        moduleRecords = await prisma.roomAllotmentLetter.findMany({
          where,
          include: {
            allocation: {
              include: {
                student: true,
                bed: { include: { room: { include: { floor: { include: { block: true } } } } } },
              },
            },
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        });
        moduleExtraStats = { totalLetters: totalRecords };
        break;
      }

      case "Students": {
        const where = {};
        if (search) {
          where.OR = [
            { fullName: { contains: search } },
            { collegeId: { contains: search } },
            { phone: { contains: search } },
          ];
        }
        totalRecords = await prisma.student.count({ where });
        moduleRecords = await prisma.student.findMany({
          where,
          include: {
            user: { select: { email: true, status: true, createdAt: true } },
            allocations: {
              where: { status: "active" },
              include: { bed: { include: { room: { include: { floor: { include: { block: true } } } } } } },
            },
          },
          skip,
          take: limitNum,
          orderBy: { id: "desc" },
        });
        const allocatedCount = await prisma.allocation.count({ where: { status: "active" } });
        moduleExtraStats = { totalStudents: totalRecords, allocatedCount, unallocatedCount: Math.max(0, totalRecords - allocatedCount) };
        break;
      }

      case "Staff": {
        const where = { role: { name: { in: ["WARDEN", "SECURITY", "HOSTEL_ADMIN", "ADMIN"] } } };
        if (search) {
          where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
          ];
        }
        totalRecords = await prisma.user.count({ where });
        moduleRecords = await prisma.user.findMany({
          where,
          include: { role: true, wardenProfile: true, securityProfile: true },
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        });
        const wardenCount = await prisma.warden.count();
        const securityCount = await prisma.securityStaff.count();
        moduleExtraStats = { totalStaff: totalRecords, wardenCount, securityCount };
        break;
      }

      case "Fees": {
        const where = {};
        if (Object.keys(dateWhere).length) where.dueDate = dateWhere;

        totalRecords = await prisma.fee.count({ where });
        moduleRecords = await prisma.fee.findMany({
          where,
          include: { student: true },
          skip,
          take: limitNum,
          orderBy: { dueDate: "desc" },
        });

        const paidAgg = await prisma.fee.aggregate({ _sum: { amount: true }, where: { status: "paid" } });
        const unpaidAgg = await prisma.fee.aggregate({ _sum: { amount: true }, where: { status: "unpaid" } });
        moduleExtraStats = {
          totalFees: totalRecords,
          paidAmount: Number(paidAgg._sum.amount || 0),
          unpaidAmount: Number(unpaidAgg._sum.amount || 0),
          paidCount: await prisma.fee.count({ where: { status: "paid" } }),
          unpaidCount: await prisma.fee.count({ where: { status: "unpaid" } }),
        };
        break;
      }

      case "Leaves": {
        const where = {};
        if (Object.keys(dateWhere).length) where.startDate = dateWhere;

        totalRecords = await prisma.leaveRequest.count({ where });
        moduleRecords = await prisma.leaveRequest.findMany({
          where,
          include: { student: true },
          skip,
          take: limitNum,
          orderBy: { startDate: "desc" },
        });

        const pending = await prisma.leaveRequest.count({ where: { status: "pending" } });
        const approved = await prisma.leaveRequest.count({ where: { status: "approved" } });
        const rejected = await prisma.leaveRequest.count({ where: { status: "rejected" } });
        moduleExtraStats = { totalLeaves: totalRecords, pending, approved, rejected };
        break;
      }

      case "Visitors": {
        const where = {};
        if (search) {
          where.OR = [
            { fullName: { contains: search } },
            { studentName: { contains: search } },
            { relationship: { contains: search } },
          ];
        }

        totalRecords = await prisma.visitor.count({ where });
        moduleRecords = await prisma.visitor.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        });

        const approved = await prisma.visitor.count({ where: { status: "Approved" } });
        const pending = await prisma.visitor.count({ where: { status: "Pending" } });
        const checkedIn = await prisma.visitor.count({ where: { status: "Checked-In" } });
        const checkedOut = await prisma.visitor.count({ where: { status: "Checked-Out" } });
        moduleExtraStats = { totalVisitors: totalRecords, approved, pending, checkedIn, checkedOut };
        break;
      }

      case "InOutRegister": {
        const where = {};
        if (Object.keys(dateWhere).length) where.date = dateWhere;

        totalRecords = await prisma.attendance.count({ where });
        moduleRecords = await prisma.attendance.findMany({
          where,
          include: { student: true },
          skip,
          take: limitNum,
          orderBy: { date: "desc" },
        });

        const presentCount = await prisma.attendance.count({ where: { present: true } });
        const absentCount = await prisma.attendance.count({ where: { present: false } });
        moduleExtraStats = { totalLogs: totalRecords, presentCount, absentCount };
        break;
      }

      case "Complaints": {
        const where = {};
        if (search) {
          where.OR = [
            { title: { contains: search } },
            { category: { contains: search } },
          ];
        }

        totalRecords = await prisma.complaint.count({ where });
        moduleRecords = await prisma.complaint.findMany({
          where,
          include: { student: true },
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        });

        const open = await prisma.complaint.count({ where: { status: "open" } });
        const assigned = await prisma.complaint.count({ where: { status: "assigned" } });
        const resolved = await prisma.complaint.count({ where: { status: "resolved" } });
        moduleExtraStats = { totalComplaints: totalRecords, open, assigned, resolved };
        break;
      }

      case "NoticeBoard": {
        totalRecords = await prisma.notice.count();
        moduleRecords = await prisma.notice.findMany({
          include: { createdBy: { select: { name: true, email: true } } },
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        });

        const active = await prisma.notice.count({ where: { isActive: true } });
        moduleExtraStats = { totalNotices: totalRecords, active, inactive: Math.max(0, totalRecords - active) };
        break;
      }

      default: {
        // Overview default
        moduleRecords = [];
        totalRecords = 0;
        break;
      }
    }

    return {
      summary: {
        totalStudents: totalStudents || 0,
        totalBeds: totalBeds || 0,
        occupiedBeds: occupiedBeds || 0,
        vacantBeds: Math.max(0, totalBeds - occupiedBeds),
        totalBlocks: totalBlocks || 0,
        totalRooms: totalRooms || 0,
        pendingAdmissions: pendingAdmissions || 0,
        totalAllocationLetters: totalAllocationLetters || 0,
        totalStaff: totalStaff || 0,
        totalFeesCollected: Number(totalFeesCollected._sum.amount || 0),
        pendingFeesCount: pendingFeesCount || 0,
        totalLeaves: totalLeaves || 0,
        pendingLeavesCount: pendingLeavesCount || 0,
        totalVisitors: totalVisitors || 0,
        activeVisitorsCount: activeVisitorsCount || 0,
        todayAttendanceCount: todayAttendanceCount || 0,
        totalComplaints: totalComplaints || 0,
        openComplaintsCount: openComplaintsCount || 0,
        totalNotices: totalNotices || 0,
        activeNoticesCount: activeNoticesCount || 0,
      },
      module,
      moduleExtraStats,
      pagination: {
        totalRecords,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRecords / limitNum) || 1,
      },
      records: moduleRecords,
    };
  }

  /**
   * POST /api/admin/reports
   * Generates downloadable CSV content for any of the 12 requested modules.
   */
  static async generateReportContent({ reportType = "Overview", startDate, endDate }, user) {
    const data = await this.getSummaryStats({ module: reportType, startDate, endDate, limit: 1000 });
    const BOM = "\uFEFF";
    let rows = [];

    rows.push(["Report Title", `CampusOS Hostel ${reportType} Report`]);
    rows.push(["Generated At", new Date().toLocaleString()]);
    rows.push(["Generated By", user?.name || user?.email || "Hostel Admin"]);
    if (startDate || endDate) {
      rows.push(["Date Range Filter", `${startDate || "Beginning"} to ${endDate || "Present"}`]);
    }
    rows.push([]); // Blank separator row

    const recs = data.records || [];

    if (reportType === "Hostel") {
      rows.push(["Room Number", "Floor", "Block", "Capacity", "Rent (INR)", "Occupied Beds", "Furniture Items"]);
      recs.forEach((r) => {
        const occBeds = r.beds?.filter((b) => b.allocations?.length > 0).length || 0;
        rows.push([
          r.number,
          r.floor?.number ?? "N/A",
          r.floor?.block?.name ?? "N/A",
          r.capacity,
          Number(r.rent || 0),
          occBeds,
          r.furniture?.length || 0,
        ]);
      });
    } else if (reportType === "Admissions") {
      rows.push(["User ID", "Full Name", "Email", "Role", "Status", "Registered Date"]);
      recs.forEach((u) => {
        rows.push([
          u.id,
          u.name || u.studentProfile?.fullName || "Applicant",
          u.email,
          u.role?.name || "STUDENT",
          u.status,
          new Date(u.createdAt).toLocaleDateString(),
        ]);
      });
    } else if (reportType === "AllocationLetters") {
      rows.push(["Reference No", "Student Name", "College ID", "Room No", "Block", "Issued Date", "Signed By"]);
      recs.forEach((l) => {
        const alloc = l.allocation;
        rows.push([
          l.referenceNo,
          alloc?.student?.fullName || "Student",
          alloc?.student?.collegeId || "N/A",
          alloc?.bed?.room?.number || "N/A",
          alloc?.bed?.room?.floor?.block?.name || "N/A",
          new Date(l.issuedDate).toLocaleDateString(),
          l.signedBy || "Warden Office",
        ]);
      });
    } else if (reportType === "Students") {
      rows.push(["Student Name", "College ID", "Phone", "Email", "Block", "Room", "Status"]);
      recs.forEach((s) => {
        const alloc = s.allocations?.[0];
        rows.push([
          s.fullName,
          s.collegeId,
          s.phone,
          s.user?.email || "N/A",
          alloc?.bed?.room?.floor?.block?.name || "Unassigned",
          alloc?.bed?.room?.number || "Unassigned",
          s.user?.status || "active",
        ]);
      });
    } else if (reportType === "Staff") {
      rows.push(["Staff Name", "Email", "Role", "Phone / Contact", "Joined Date"]);
      recs.forEach((st) => {
        const phone = st.wardenProfile?.phone || st.securityProfile?.phone || "N/A";
        rows.push([
          st.name || "Staff Member",
          st.email,
          st.role?.name || "STAFF",
          phone,
          new Date(st.createdAt).toLocaleDateString(),
        ]);
      });
    } else if (reportType === "Fees") {
      rows.push(["Student Name", "College ID", "Amount (INR)", "Due Date", "Payment Date", "Status"]);
      recs.forEach((f) => {
        rows.push([
          f.student?.fullName || "Student",
          f.student?.collegeId || "N/A",
          Number(f.amount),
          new Date(f.dueDate).toLocaleDateString(),
          f.paymentDate ? new Date(f.paymentDate).toLocaleDateString() : "Unpaid",
          f.status,
        ]);
      });
    } else if (reportType === "Leaves") {
      rows.push(["Student Name", "Reason", "Start Date", "End Date", "Status"]);
      recs.forEach((l) => {
        rows.push([
          l.student?.fullName || "Student",
          l.reason,
          new Date(l.startDate).toLocaleDateString(),
          new Date(l.endDate).toLocaleDateString(),
          l.status,
        ]);
      });
    } else if (reportType === "Visitors") {
      rows.push(["Visitor Name", "Phone", "Relationship", "Student Visited", "Check-In Date", "Warden Status"]);
      recs.forEach((v) => {
        rows.push([
          v.fullName,
          v.visitorPhone || "N/A",
          v.relationship,
          v.studentName,
          v.checkIn ? new Date(v.checkIn).toLocaleDateString() : new Date(v.createdAt).toLocaleDateString(),
          v.status,
        ]);
      });
    } else if (reportType === "InOutRegister") {
      rows.push(["Student Name", "College ID", "Log Date", "Attendance Status", "Remarks"]);
      recs.forEach((a) => {
        rows.push([
          a.student?.fullName || "Student",
          a.student?.collegeId || "N/A",
          new Date(a.date).toLocaleDateString(),
          a.present ? "Present (In-Campus)" : "Absent (Out)",
          a.remarks || "N/A",
        ]);
      });
    } else if (reportType === "Complaints") {
      rows.push(["Title", "Category", "Priority", "Student Name", "Status", "Date Submitted"]);
      recs.forEach((c) => {
        rows.push([
          c.title,
          c.category,
          c.priority,
          c.student?.fullName || "Student",
          c.status,
          new Date(c.createdAt).toLocaleDateString(),
        ]);
      });
    } else if (reportType === "NoticeBoard") {
      rows.push(["Title", "Content Preview", "Is Active", "Posted By", "Date Created"]);
      recs.forEach((n) => {
        rows.push([
          n.title,
          n.content ? n.content.substring(0, 50) + "..." : "N/A",
          n.isActive ? "Yes" : "No",
          n.createdBy?.name || n.createdBy?.email || "Admin",
          new Date(n.createdAt).toLocaleDateString(),
        ]);
      });
    } else {
      // Overview summary
      rows.push(["Metric Category", "Metric Name", "Value"]);
      rows.push(["Students", "Total Registered Students", data.summary.totalStudents]);
      rows.push(["Capacity", "Total Beds", data.summary.totalBeds]);
      rows.push(["Capacity", "Occupied Beds", data.summary.occupiedBeds]);
      rows.push(["Capacity", "Vacant Beds", data.summary.vacantBeds]);
      rows.push(["Finance", "Total Fees Collected (INR)", data.summary.totalFeesCollected]);
      rows.push(["Finance", "Pending Fee Records", data.summary.pendingFeesCount]);
      rows.push(["Leaves", "Total Leave Requests", data.summary.totalLeaves]);
      rows.push(["Visitors", "Total Visitor Logs", data.summary.totalVisitors]);
      rows.push(["Complaints", "Total Complaints", data.summary.totalComplaints]);
      rows.push(["Notices", "Total Notices Posted", data.summary.totalNotices]);
    }

    const csvText =
      BOM +
      rows
        .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n");

    return csvText;
  }
}
