import { Router } from "express";
import { NoticeController } from "../controllers/notice.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/role.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { createNoticeSchema, updateNoticeSchema } from "../validations/notice.validation.js";

const router = Router();

// All notice routes require a valid JWT
router.use(authenticate);

// Everyone can view notices
router.get("/", authorize("superadmin", "admin", "warden", "student", "security", "librarian", "store"), NoticeController.getAll);

// Only admins and wardens can create/edit
router.use(authorize("superadmin", "admin", "warden"));

router.post("/", validate(createNoticeSchema), NoticeController.create);
router.put("/:id", validate(updateNoticeSchema), NoticeController.update);
router.delete("/:id", NoticeController.remove);

export default router;
