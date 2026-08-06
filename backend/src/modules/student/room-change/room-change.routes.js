import { Router } from "express";
import * as roomChangeController from "./room-change.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("student"));

router.post("/", roomChangeController.submitRequest);
router.get("/", roomChangeController.getMyRequests);

export default router;
