const AppError = require('../utils/AppError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('No credentials provided.', 401));
    }

    if (!roles.includes(req.user.role.toLowerCase())) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};

module.exports = authorize;
