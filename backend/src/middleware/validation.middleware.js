export const validate = (schema, type = "body") => (req, res, next) => {
  try {
    schema.parse(req[type]);
    next();
  } catch (error) {
    if (error.errors) {
      const errors = error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }
    next(error);
  }
};

export default validate;
