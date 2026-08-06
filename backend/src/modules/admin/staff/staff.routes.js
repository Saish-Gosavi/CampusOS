import { Router } from "express";
import { StaffController } from "./staff.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

// Apply auth and admin authorization to all staff management routes
router.use(authenticate);
router.use(authorize("admin", "superadmin", "senioradmin"));

router.get("/", StaffController.getAllStaff);
router.post("/", StaffController.createStaff);
router.put("/:id", StaffController.updateStaff);
router.delete("/:id", StaffController.deleteStaff);
router.get("/:id/attendance", StaffController.getAttendance);

export default router;
