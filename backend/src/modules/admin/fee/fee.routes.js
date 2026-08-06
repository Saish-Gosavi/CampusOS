import { Router } from "express";
import * as feeController from "./fee.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

// Apply auth middleware to all fee routes
router.use(authenticate);
// Authorize superadmin, senioradmin, admin for these routes
router.use(authorize("superadmin", "senioradmin", "admin"));

// Get Dashboard Statistics
router.get("/statistics", feeController.getDashboardStats);

// Get All Student Fee Records
router.get("/", feeController.getAllFeeRecords);

// Get Fee Records for a Specific Student
router.get("/:studentId", feeController.getStudentFeeRecords);

// Verify a Payment
router.put("/:id/verify", feeController.verifyPayment);

// Reject a Payment
router.put("/:id/reject", feeController.rejectPayment);

// Release Receipt to Student (sends notification)
router.put("/:id/release-receipt", feeController.releaseReceipt);

// For POST (e.g., adding a new fee requirement)
// router.post("/", feeController.createFee);

export default router;

// Student-facing router for fetching their own receipts
export const studentFeeRouter = Router();
studentFeeRouter.use(authenticate);
studentFeeRouter.use(authorize("superadmin", "student"));
studentFeeRouter.get("/my-receipts", feeController.getMyReceipts);
