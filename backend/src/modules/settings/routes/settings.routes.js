import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("superadmin"));

router.get("/", SettingsController.getSettings);
router.put("/", SettingsController.updateSettings);
router.post("/reset", SettingsController.resetSettings);

export default router;
