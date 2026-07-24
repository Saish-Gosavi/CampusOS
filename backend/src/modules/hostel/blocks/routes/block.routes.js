import { Router } from "express";
import { BlockController } from "../controllers/block.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { blockSchema } from "../validations/block.validation.js";

const router = Router();

router.get("/", BlockController.getAll);
router.get("/:id", BlockController.getById);
router.post("/", validate(blockSchema), BlockController.create);
router.put("/:id", validate(blockSchema), BlockController.update);
router.delete("/:id", BlockController.delete);

export default router;
