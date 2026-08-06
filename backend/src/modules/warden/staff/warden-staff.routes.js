import { Router } from "express";
import { WardenStaffController } from "./warden-staff.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

// Apply auth and warden authorization to all routes
router.use(authenticate);
router.use(authorize("warden"));

router.get("/", WardenStaffController.getAllStaff);
router.post("/", WardenStaffController.createStaff);
router.put("/:id", WardenStaffController.updateStaff);
router.delete("/:id", WardenStaffController.deleteStaff);

// Attendance routes
router.get("/:id/attendance", WardenStaffController.getAttendance);
router.post("/:id/attendance", WardenStaffController.markAttendance);

export default router;
