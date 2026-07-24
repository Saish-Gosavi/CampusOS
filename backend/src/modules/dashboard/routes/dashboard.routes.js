import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/superadmin", authorize("superadmin"), DashboardController.getSuperAdminStats);

export default router;
