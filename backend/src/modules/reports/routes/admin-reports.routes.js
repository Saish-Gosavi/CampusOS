import { Router } from "express";
import { AdminReportsController } from "../controllers/admin-reports.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("admin", "superadmin", "senioradmin", "warden"));

/** PDD API Checklist */
router.get("/", AdminReportsController.getReports);
router.post("/", AdminReportsController.generateReport);

// Aliases for compatibility
router.get("/summary", AdminReportsController.getReports);
router.get("/history", AdminReportsController.getReports);
router.post("/generate", AdminReportsController.generateReport);
router.post("/log-export", AdminReportsController.generateReport);

export default router;
