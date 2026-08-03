import { Router } from "express";
import { RoomAllotmentLetterController } from "../controllers/room-allotment-letter.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { createAllotmentLetterSchema, updateAllotmentLetterSchema } from "../validations/room-allotment-letter.validation.js";

const router = Router();

router.get("/", RoomAllotmentLetterController.getAll);
router.get("/:id", RoomAllotmentLetterController.getById);
router.post("/", validate(createAllotmentLetterSchema), RoomAllotmentLetterController.create);
router.put("/:id", validate(updateAllotmentLetterSchema), RoomAllotmentLetterController.update);
router.delete("/:id", RoomAllotmentLetterController.delete);

export default router;
