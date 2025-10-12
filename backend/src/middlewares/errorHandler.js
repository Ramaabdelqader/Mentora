import { ValidationError, UniqueConstraintError } from "sequelize";

export function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err instanceof ValidationError) {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ message: "Validation error", errors: messages });
  }
  if (err instanceof UniqueConstraintError) {
    const messages = err.errors.map((e) => e.message);
    return res.status(409).json({ message: "Unique constraint error", errors: messages });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
}
