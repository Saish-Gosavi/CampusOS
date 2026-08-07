import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/superadmin", authorize("superadmin", "senioradmin"), DashboardController.getSuperAdminStats);
router.get("/hosteladmin", authorize("superadmin", "senioradmin", "admin"), DashboardController.getHostelAdminStats);
router.get("/warden", authorize("superadmin", "senioradmin", "admin", "warden"), DashboardController.getWardenStats);

export default router;
