import { Router } from "express";
import { FeeController } from "../controllers/fee.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { feeSchema } from "../validations/fee.validation.js";

const router = Router();

router.get("/", FeeController.getAll);
router.get("/:id", FeeController.getById);
router.post("/", validate(feeSchema), FeeController.create);
router.put("/:id", validate(feeSchema), FeeController.update);
router.delete("/:id", FeeController.delete);

export default router;
