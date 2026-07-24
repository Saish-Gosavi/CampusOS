import { Router } from "express";
import { RolesController } from "../controllers/roles.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

router.get("/", authenticate, authorize("superadmin"), RolesController.getAllRoles);

export default router;
