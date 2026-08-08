import { Router } from "express";
import { MessController } from "../controllers/mess.controller.js";
import { authenticate } from "../../../../middleware/auth.middleware.js";
import { authorize } from "../../../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.getDashboard);
router.get("/menu", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.getMenu);
router.put("/menu", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.updateMenu);

router.get("/attendance", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.getAttendance);
router.get("/feedback", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.getFeedback);
router.get("/inventory", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.getInventory);
router.put("/inventory/:id", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.updateInventory);
router.post("/inventory", authorize("superadmin", "senioradmin", "admin", "warden"), MessController.createInventoryItem);

export default router;
