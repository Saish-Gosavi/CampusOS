import { Router } from "express";
import { FurnitureController } from "../controllers/furniture.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { furnitureSchema } from "../validations/furniture.validation.js";

const router = Router();

router.get("/", FurnitureController.getAll);
router.get("/:id", FurnitureController.getById);
router.post("/", validate(furnitureSchema), FurnitureController.create);
router.put("/:id", validate(furnitureSchema), FurnitureController.update);
router.delete("/:id", FurnitureController.delete);

export default router;
