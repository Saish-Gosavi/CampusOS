import { Router } from "express";
import { RolesController } from "../controllers/roles.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

router
  .route("/")
  .get(authenticate, authorize("superadmin"), RolesController.getAllRoles)
  .post(authenticate, authorize("superadmin"), RolesController.createRole);

router
  .route("/:id")
  .put(authenticate, authorize("superadmin"), RolesController.updateRole)
  .delete(authenticate, authorize("superadmin"), RolesController.deleteRole);

export default router;
