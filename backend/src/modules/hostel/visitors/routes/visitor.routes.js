import { Router } from "express";
import { VisitorController } from "../controllers/visitor.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import {
  createVisitorSchema,
  updateVisitorSchema,
  wardenReviewSchema,
} from "../validations/visitor.validation.js";

const router = Router();

// Specific named routes MUST come before /:id to avoid route conflicts
router.get("/pending", VisitorController.getPending);
router.get("/processed", VisitorController.getProcessed);

router.get("/", VisitorController.getAll);
router.get("/:id", VisitorController.getById);
router.post("/", validate(createVisitorSchema), VisitorController.create);
router.put("/:id/review", validate(wardenReviewSchema), VisitorController.wardenReview);
router.put("/:id", validate(updateVisitorSchema), VisitorController.update);
router.delete("/:id", VisitorController.delete);

export default router;
