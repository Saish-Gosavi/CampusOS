import { jwtConfig } from "../config/jwt.js";
import { prisma } from "../config/prisma.js";
import AppError from "../utils/AppError.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Please log in to access this resource", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Authentication token is missing", 401));
    }

    let decoded;
    try {
      decoded = jwtConfig.verifyToken(token);
    } catch (err) {
      return next(new AppError("Invalid or expired authentication token", 401));
    }

    // Verify user exists and status is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user) {
      return next(new AppError("The user belonging to this token no longer exists", 401));
    }

    if (user.status !== "active") {
      return next(new AppError("This user account has been suspended", 403));
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      hostelId: user.hostelId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
