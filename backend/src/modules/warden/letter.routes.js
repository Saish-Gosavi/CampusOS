import { Router } from "express";
import { WardenLetterController } from "./letter.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);

// Warden & Admin endpoints
router.get("/requests", authorize("warden", "admin", "superadmin", "senioradmin"), WardenLetterController.getWardenRequests);
router.put("/requests/:id/approve", authorize("warden", "admin", "superadmin", "senioradmin"), WardenLetterController.approveRequest);
router.put("/requests/:id/reject", authorize("warden", "admin", "superadmin", "senioradmin"), WardenLetterController.rejectRequest);
router.post("/requests/:id/generate", authorize("warden", "admin", "superadmin", "senioradmin"), WardenLetterController.generateLetter);

// Student endpoints
router.post("/student-requests", authorize("student"), WardenLetterController.studentSubmitRequest);
router.get("/student-requests", authorize("student"), WardenLetterController.studentGetRequests);

// Audit logging endpoint
router.post("/log-download", WardenLetterController.logDownload);

export default router;
