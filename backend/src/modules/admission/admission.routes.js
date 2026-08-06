import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as ctrl from "./admission.controller.js";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "src/uploads/admissions");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for document uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// ─── PUBLIC routes (no auth needed) ───────────────────────────────────────────
router.get("/config",           ctrl.getPublicConfig);
router.post("/apply", upload.any(), ctrl.submitApplication);

// ─── ADMIN routes (auth required) ────────────────────────────────────────────
router.get("/admin/admissions",              authenticate, ctrl.listApplications);
router.get("/admin/admissions/:id",          authenticate, ctrl.getApplication);
router.put("/admin/admissions/:id/status",   authenticate, ctrl.updateStatus);
router.get("/admin/admission-config",        authenticate, ctrl.getAdminConfig);
router.put("/admin/admission-config",        authenticate, ctrl.updateAdminConfig);

export default router;
