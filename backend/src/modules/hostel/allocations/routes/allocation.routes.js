import { Router } from "express";
import { AllocationController } from "../controllers/allocation.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { allocationSchema } from "../validations/allocation.validation.js";

const router = Router();

router.get("/", AllocationController.getAll);
router.get("/:id", AllocationController.getById);
router.post("/", validate(allocationSchema), AllocationController.create);
router.put("/:id", validate(allocationSchema), AllocationController.update);
router.delete("/:id", AllocationController.delete);

export default router;
