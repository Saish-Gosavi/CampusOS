import { Router } from "express";
import { LeaveController } from "../controllers/leave.controller.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Stats
router.get("/stats", LeaveController.getStats);

// CRUD
router.get("/", LeaveController.getAll);
router.get("/:id", LeaveController.getById);
router.post("/", LeaveController.create);
router.put("/:id/status", LeaveController.updateStatus);   // Approve / Reject
router.put("/:id", LeaveController.update);                // Edit pending request
router.delete("/:id", LeaveController.delete);

export default router;
