import { Router } from "express";
import { RolesController } from "../controllers/roles.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { createRoleSchema, updateRoleSchema } from "../validations/roles.validation.js";

const router = Router();

router
  .route("/")
  .get(authenticate, authorize("superadmin"), RolesController.getAllRoles)
  .post(authenticate, authorize("superadmin"), validate(createRoleSchema), RolesController.createRole);

router
  .route("/:id")
  .get(authenticate, authorize("superadmin"), RolesController.getRoleById)
  .put(authenticate, authorize("superadmin"), validate(updateRoleSchema), RolesController.updateRole)
  .delete(authenticate, authorize("superadmin"), RolesController.deleteRole);

export default router;

