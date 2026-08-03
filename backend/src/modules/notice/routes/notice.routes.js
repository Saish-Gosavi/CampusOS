import { Router } from "express";
import { NoticeController } from "../controllers/notice.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { createNoticeSchema, updateNoticeSchema } from "../validations/notice.validation.js";

const router = Router();

// All notice routes require a valid JWT + Super Admin role
router.use(authenticate);
router.use(authorize("superadmin"));

router.get("/", NoticeController.getAll);
router.post("/", validate(createNoticeSchema), NoticeController.create);
router.put("/:id", validate(updateNoticeSchema), NoticeController.update);
router.delete("/:id", NoticeController.remove);

export default router;
