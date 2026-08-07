import { Router } from "express";
import { LettersController } from "../controllers/letters.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Student routes
router.get("/student", authorize("student"), LettersController.getStudentRequests);
router.post("/request", authorize("student"), LettersController.requestLetter);

// Warden routes
router.get("/warden", authorize("warden"), LettersController.getHostelRequests);
router.put("/:id/approve", authorize("warden"), LettersController.approveLetter);

export default router;
