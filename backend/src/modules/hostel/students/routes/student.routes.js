import { Router } from "express";
import { StudentController } from "../controllers/student.controller.js";
import { validate } from "../../../../middleware/validation.middleware.js";
import { createStudentSchema, updateStudentSchema } from "../validations/student.validation.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("warden", "admin", "senioradmin", "superadmin"));

router.get("/", StudentController.getAllStudents);
router.get("/:id", StudentController.getStudentById);

// Admin-only write actions (Creating/Editing/Deleting student logins)
router.post("/", authorize("admin", "senioradmin", "superadmin"), validate(createStudentSchema), StudentController.createStudent);
router.put("/:id", authorize("admin", "senioradmin", "superadmin"), validate(updateStudentSchema), StudentController.updateStudent);
router.delete("/:id", authorize("admin", "senioradmin", "superadmin"), StudentController.deleteStudent);

export default router;
