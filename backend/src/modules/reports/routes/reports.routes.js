import { Router } from "express";
import { ReportsController } from "../controllers/reports.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

// Apply auth and role verification to all routes below
router.use(authenticate);
router.use(authorize("superadmin"));

router.get("/", ReportsController.getSummary);
router.post("/", ReportsController.exportCsv);

export default router;
