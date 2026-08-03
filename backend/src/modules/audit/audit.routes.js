import { Router } from "express";
import { AuditLogController } from "./audit.controller.js";

const router = Router();

router.get("/", AuditLogController.getLogs);

export default router;
