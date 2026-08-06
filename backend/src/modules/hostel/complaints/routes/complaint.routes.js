import { Router } from "express";
import { ComplaintController } from "../controllers/complaint.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { complaintSchema, updateComplaintSchema } from "../validations/complaint.validation.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", ComplaintController.getAll);
router.get("/:id", ComplaintController.getById);
router.post("/", validate(complaintSchema), ComplaintController.create);
router.put("/:id", validate(updateComplaintSchema), ComplaintController.update);
router.patch("/:id", validate(updateComplaintSchema), ComplaintController.update);
router.delete("/:id", ComplaintController.delete);

export default router;

