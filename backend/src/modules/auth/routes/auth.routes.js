import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validations/auth.validation.js";

const router = Router();

// Public routes
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);

// Protected routes (require valid JWT)
router.get("/me", authenticate, AuthController.me);
router.post("/change-password", authenticate, validate(changePasswordSchema), AuthController.changePassword);

export default router;
