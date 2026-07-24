import { Router } from "express";
import { VisitorController } from "../controllers/visitor.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { visitorSchema } from "../validations/visitor.validation.js";

const router = Router();

router.get("/", VisitorController.getAll);
router.get("/:id", VisitorController.getById);
router.post("/", validate(visitorSchema), VisitorController.create);
router.put("/:id", validate(visitorSchema), VisitorController.update);
router.delete("/:id", VisitorController.delete);

export default router;
