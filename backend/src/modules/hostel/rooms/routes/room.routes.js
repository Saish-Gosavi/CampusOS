import { Router } from "express";
import { RoomController } from "../controllers/room.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { roomSchema, updateRoomSchema } from "../validations/room.validation.js";

const router = Router();

router.get("/", RoomController.getAll);
router.get("/:id", RoomController.getById);
router.post("/", validate(roomSchema), RoomController.create);
router.put("/:id", validate(updateRoomSchema), RoomController.update);
router.delete("/:id", RoomController.delete);

export default router;
