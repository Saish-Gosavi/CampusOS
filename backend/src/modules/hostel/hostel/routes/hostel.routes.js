import { Router } from "express";
import { HostelController } from "../controllers/hostel.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { hostelSchema } from "../validations/hostel.validation.js";

const router = Router();

router.get("/", HostelController.getAll);
router.get("/:id", HostelController.getById);
router.post("/", validate(hostelSchema), HostelController.create);
router.put("/:id", validate(hostelSchema), HostelController.update);
router.delete("/:id", HostelController.delete);

// Admin & Facility Management Routes
router.post("/:id/admins", HostelController.createAdminForCollege);
router.delete("/:id/admins/:userId", HostelController.deleteAdminFromCollege);

export default router;
