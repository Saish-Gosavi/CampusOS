import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { updateProfileSchema, createUserSchema, updateUserSchema } from "../validations/users.validation.js";

const router = Router();

router.use(authenticate);

router.get("/profile", UsersController.getProfile);
router.put("/profile", validate(updateProfileSchema), UsersController.updateProfile);

// Administrative User Management
router.get("/", authorize("superadmin", "senioradmin", "admin"), UsersController.getAllUsers);
router.post("/", authorize("superadmin", "senioradmin", "admin"), validate(createUserSchema), UsersController.createUser);
router.put("/:id", authorize("superadmin", "senioradmin"), validate(updateUserSchema), UsersController.updateUser);
router.delete("/:id", authorize("superadmin", "senioradmin"), UsersController.deleteUser);

export default router;
