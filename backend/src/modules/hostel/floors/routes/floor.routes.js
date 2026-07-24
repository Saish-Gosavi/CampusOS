import { Router } from "express";
import { FloorController } from "../controllers/floor.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { floorSchema } from "../validations/floor.validation.js";

const router = Router();

router.get("/", FloorController.getAll);
router.get("/:id", FloorController.getById);
router.post("/", validate(floorSchema), FloorController.create);
router.put("/:id", validate(floorSchema), FloorController.update);
router.delete("/:id", FloorController.delete);

export default router;
