import { Router } from "express";
import * as roomChangeController from "./room-change.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

// Apply auth middleware
router.use(authenticate);
router.use(authorize("warden", "admin", "superadmin")); // Assuming admins can also do this

router.get("/statistics", roomChangeController.getStatistics);
router.get("/", roomChangeController.getRequests);
router.put("/:id/approve", roomChangeController.approveRequest);
router.put("/:id/reject", roomChangeController.rejectRequest);

export default router;
