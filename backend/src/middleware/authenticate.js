const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const config = require('../config');

const authenticate = (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};

module.exports = authenticate;
