export const validate = (schema, type = "body") => (req, res, next) => {
  try {
    const parsed = schema.parse(req[type]);
    req[type] = parsed;
    next();
  } catch (error) {
    const issues = error.issues || error.errors;
    if (issues && Array.isArray(issues)) {
      const errors = issues.map((e) => ({
        field: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    next(error);
  }
};

export default validate;

