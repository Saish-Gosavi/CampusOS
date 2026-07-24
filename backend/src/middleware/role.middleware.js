import AppError from "../utils/AppError.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("User role is undefined", 401));
    }

    const userRole = req.user.role.toLowerCase();
    const hasRole = allowedRoles.map((r) => r.toLowerCase()).includes(userRole);

    if (!hasRole) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
  };
};

export default authorize;
