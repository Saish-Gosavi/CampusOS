export default (err, req, res, next) => {
  // Handle Zod Validation Errors if passed to next()
  if (err.name === "ZodError" || err.issues || err.errors) {
    const issues = err.issues || err.errors;
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
  }

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

