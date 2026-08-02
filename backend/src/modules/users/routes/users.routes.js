import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { updateProfileSchema, createUserSchema } from "../validations/users.validation.js";

const router = Router();

router.use(authenticate);

router.get("/profile", UsersController.getProfile);
router.put("/profile", validate(updateProfileSchema), UsersController.updateProfile);

// Administrative User Management
router.get("/", authorize("superadmin", "admin"), UsersController.getAllUsers);
router.post("/", authorize("superadmin", "admin"), validate(createUserSchema), UsersController.createUser);
router.delete("/:id", authorize("superadmin"), UsersController.deleteUser);

export default router;
