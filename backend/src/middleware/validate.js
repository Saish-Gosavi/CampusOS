const AppError = require('../utils/AppError');

const validate = (schemaValidator, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schemaValidator(req[source]);
    if (error) {
      const message = error.details ? error.details.map(d => d.message).join(', ') : error.message;
      return next(new AppError(message, 400));
    }
    req[source] = value;
    next();
  };
};

module.exports = validate;
