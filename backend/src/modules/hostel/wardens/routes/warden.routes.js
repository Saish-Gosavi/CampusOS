import { Router } from "express";
import { WardenController } from "../controllers/warden.controller.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/role.middleware.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { createWardenSchema, updateWardenSchema } from "../validations/warden.validation.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("superadmin", "senioradmin", "admin"), WardenController.getAll);
router.get("/:id", authorize("superadmin", "senioradmin", "admin"), WardenController.getById);
router.post("/", authorize("superadmin", "senioradmin", "admin"), validate(createWardenSchema), WardenController.create);
router.put("/:id", authorize("superadmin", "senioradmin", "admin"), validate(updateWardenSchema), WardenController.update);
router.delete("/:id", authorize("superadmin", "senioradmin", "admin"), WardenController.delete);

export default router;
