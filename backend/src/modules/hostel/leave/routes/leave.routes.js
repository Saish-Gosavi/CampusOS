import { Router } from "express";
import { LeaveController } from "../controllers/leave.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { leaveSchema } from "../validations/leave.validation.js";

const router = Router();

router.get("/", LeaveController.getAll);
router.get("/:id", LeaveController.getById);
router.post("/", validate(leaveSchema), LeaveController.create);
router.put("/:id", validate(leaveSchema), LeaveController.update);
router.delete("/:id", LeaveController.delete);

export default router;
