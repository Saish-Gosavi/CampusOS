import { Router } from "express";
import { BedController } from "../controllers/bed.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { bedSchema } from "../validations/bed.validation.js";

const router = Router();

router.get("/", BedController.getAll);
router.get("/:id", BedController.getById);
router.post("/", validate(bedSchema), BedController.create);
router.put("/:id", validate(bedSchema), BedController.update);
router.delete("/:id", BedController.delete);

export default router;
