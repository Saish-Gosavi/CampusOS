import { Router } from "express";
import { RolesController } from "../controllers/roles.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";
import { ROLES } from "../../../constants/index.js";

const router = Router();

// Endpoint for GET & POST /api/super_admin/roles-and-permissions (or /api/roles/roles-and-permissions)
router
  .route("/roles-and-permissions")
  .get(authenticate, authorize(ROLES.SUPERADMIN), RolesController.getRolesAndPermissions)
  .post(authenticate, authorize(ROLES.SUPERADMIN), RolesController.createRoleAndPermissions);

router
  .route("/")
  .get(authenticate, authorize(ROLES.SUPERADMIN), RolesController.getAllRoles);

export default router;


