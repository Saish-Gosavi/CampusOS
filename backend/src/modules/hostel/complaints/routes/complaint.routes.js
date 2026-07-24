import { Router } from "express";
import { ComplaintController } from "../controllers/complaint.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { complaintSchema } from "../validations/complaint.validation.js";

const router = Router();

router.get("/", ComplaintController.getAll);
router.get("/:id", ComplaintController.getById);
router.post("/", validate(complaintSchema), ComplaintController.create);
router.put("/:id", validate(complaintSchema), ComplaintController.update);
router.delete("/:id", ComplaintController.delete);

export default router;
