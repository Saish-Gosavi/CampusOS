import { Router } from "express";
import { InspectionController } from "../controllers/inspection.controller.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("warden", "admin", "senioradmin", "superadmin"));

router.get("/", InspectionController.getAll);
router.get("/:id", InspectionController.getById);
router.post("/", InspectionController.create);

export default router;
