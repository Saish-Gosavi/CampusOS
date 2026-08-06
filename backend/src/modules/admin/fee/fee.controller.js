import { feeService } from "./fee.service.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await feeService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getAllFeeRecords = async (req, res, next) => {
  try {
    const records = await feeService.getAllFeeRecords();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

export const getStudentFeeRecords = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const records = await feeService.getStudentFeeRecords(studentId);
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id; // From auth middleware
    const result = await feeService.verifyPayment(id, adminId);
    res.status(200).json({ success: true, message: "Payment verified successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const rejectPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    if (!reason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }

    const result = await feeService.rejectPayment(id, reason, adminId);
    res.status(200).json({ success: true, message: "Payment rejected successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const releaseReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const result = await feeService.releaseReceipt(id, adminId);
    res.status(200).json({ success: true, message: "Receipt released to student successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const getMyReceipts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const receipts = await feeService.getStudentReceipts(userId);
    res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    next(error);
  }
};
