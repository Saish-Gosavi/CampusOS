import { Router } from "express";
import { ComplaintController } from "../controllers/complaint.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { complaintSchema, updateComplaintSchema, rejectComplaintSchema, resolveComplaintSchema } from "../validations/complaint.validation.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("warden"));

router.get("/", ComplaintController.getAll);
router.get("/:id", ComplaintController.getById);
router.post("/", validate(complaintSchema), ComplaintController.create);
router.put("/:id", validate(updateComplaintSchema), ComplaintController.update);
router.patch("/:id", validate(updateComplaintSchema), ComplaintController.update);
router.delete("/:id", ComplaintController.delete);

// Status lifecycle endpoints
router.put("/:id/accept", ComplaintController.accept);
router.put("/:id/reject", validate(rejectComplaintSchema), ComplaintController.reject);
router.put("/:id/in-progress", ComplaintController.markInProgress);
router.put("/:id/resolve", validate(resolveComplaintSchema), ComplaintController.resolve);
router.put("/:id/close", ComplaintController.close);

export default router;

