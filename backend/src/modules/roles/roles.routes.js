import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { apiResponse } from "../../helpers/response.helper.js";

const router = Router();

router.use(authenticate);

// GET /api/roles — List all system roles
router.get("/", authorize("superadmin", "senioradmin"), async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { id: "asc" },
    });
    return apiResponse.success(res, roles, "Roles retrieved successfully");
  } catch (error) {
    next(error);
  }
});

export default router;
