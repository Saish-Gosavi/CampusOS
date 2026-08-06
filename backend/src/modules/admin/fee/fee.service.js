import { prisma } from "../../../config/prisma.js";

// Helper to generate a unique receipt number
const generateReceiptNumber = async () => {
  const count = await prisma.feeReceipt.count();
  const dateStr = new Date().toISOString().slice(0, 7).replace("-", ""); // YYYYMM
  return `REC-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;
};

export const feeService = {
  getDashboardStats: async () => {
    // Total Fees Collected (sum of Paid fees amounts, but let's calculate from payments if accurate, or fees)
    const paidFees = await prisma.fee.findMany({
      where: { status: "paid" }
    });
    const totalCollected = paidFees.reduce((acc, fee) => acc + Number(fee.amount), 0);

    const students = await prisma.student.count();
    const unpaidStudentsCount = await prisma.fee.count({ where: { status: "unpaid" } });
    
    const pendingPaymentsCount = await prisma.feePayment.count({
      where: { status: "pending_verification" }
    });
    
    const rejectedPaymentsCount = await prisma.feePayment.count({
      where: { status: "rejected" }
    });

    const outstandingFees = await prisma.fee.findMany({
      where: { status: { in: ["unpaid", "overdue"] } }
    });
    const outstandingAmount = outstandingFees.reduce((acc, fee) => acc + Number(fee.amount), 0);

    const studentsWhoPaid = await prisma.fee.count({ where: { status: "paid" } });

    return {
      totalStudents: students,
      studentsWhoPaid,
      studentsPendingVerification: pendingPaymentsCount, // Approximating 1 payment per student for stats
      unpaidStudents: unpaidStudentsCount,
      rejectedPayments: rejectedPaymentsCount,
      totalFeesCollected: totalCollected,
      outstandingFeeAmount: outstandingAmount
    };
  },

  getAllFeeRecords: async () => {
    return await prisma.fee.findMany({
      include: {
        student: true,
        payments: {
          orderBy: { paymentDate: "desc" }
        },
        receipts: true
      },
      orderBy: { dueDate: "asc" }
    });
  },

  getStudentFeeRecords: async (studentId) => {
    return await prisma.fee.findMany({
      where: { studentId: parseInt(studentId, 10) },
      include: {
        payments: {
          orderBy: { paymentDate: "desc" }
        },
        receipts: true
      },
      orderBy: { dueDate: "asc" }
    });
  },

  verifyPayment: async (paymentId, adminId) => {
    const payment = await prisma.feePayment.findUnique({
      where: { id: parseInt(paymentId, 10) },
      include: { fee: true }
    });

    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.status === "verified") {
      throw new Error("Payment is already verified");
    }

    // Use transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // 1. Update Payment Status
      const updatedPayment = await tx.feePayment.update({
        where: { id: payment.id },
        data: {
          status: "verified",
          verifiedById: parseInt(adminId, 10),
          verifiedAt: new Date()
        }
      });

      // 2. Update Fee Status
      const updatedFee = await tx.fee.update({
        where: { id: payment.feeId },
        data: {
          status: "paid",
          paymentDate: new Date()
        }
      });

      // 3. Generate Receipt
      const receiptNumber = await generateReceiptNumber();
      const receipt = await tx.feeReceipt.create({
        data: {
          feeId: payment.feeId,
          paymentId: payment.id,
          receiptNumber,
          generatedById: parseInt(adminId, 10)
        }
      });

      return { payment: updatedPayment, fee: updatedFee, receipt };
    });
  },

  rejectPayment: async (paymentId, reason, adminId) => {
    const payment = await prisma.feePayment.findUnique({
      where: { id: parseInt(paymentId, 10) }
    });

    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.status === "verified") {
      throw new Error("Cannot reject an already verified payment");
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Update Payment Status to rejected
      const updatedPayment = await tx.feePayment.update({
        where: { id: payment.id },
        data: {
          status: "rejected",
          rejectionReason: reason,
          verifiedById: parseInt(adminId, 10),
          verifiedAt: new Date()
        }
      });

      // 2. Update Fee Status back to unpaid (or overdue depending on logic)
      // Since it was "pending_verification", we revert to "unpaid"
      const fee = await tx.fee.findUnique({ where: { id: payment.feeId } });
      const newStatus = fee.dueDate < new Date() ? "overdue" : "unpaid";
      
      const updatedFee = await tx.fee.update({
        where: { id: payment.feeId },
        data: { status: newStatus }
      });

      return { payment: updatedPayment, fee: updatedFee };
    });
  },

  releaseReceipt: async (receiptId, adminId) => {
    const receipt = await prisma.feeReceipt.findUnique({
      where: { id: parseInt(receiptId, 10) },
      include: {
        fee: {
          include: { student: { include: { user: true } } }
        }
      }
    });

    if (!receipt) {
      throw new Error("Receipt not found");
    }

    const studentUserId = receipt.fee.student.userId;

    // Create a notification for the student
    await prisma.notification.create({
      data: {
        userId: studentUserId,
        title: "Fee Receipt Available",
        message: `Your fee receipt ${receipt.receiptNumber} is now available for download.`
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: parseInt(adminId, 10),
        module: "FeeManagement",
        action: "RELEASE_RECEIPT",
        description: `Released receipt ${receipt.receiptNumber} to student ID ${receipt.fee.studentId}`,
        status: "Success"
      }
    });

    return receipt;
  },

  getStudentReceipts: async (userId) => {
    // Find the student profile for this user
    const student = await prisma.student.findUnique({
      where: { userId: parseInt(userId, 10) }
    });

    if (!student) {
      throw new Error("Student profile not found");
    }

    return await prisma.feeReceipt.findMany({
      where: { fee: { studentId: student.id } },
      include: {
        fee: true,
        payment: true,
        generatedBy: { select: { name: true } }
      },
      orderBy: { generatedAt: "desc" }
    });
  }
};
