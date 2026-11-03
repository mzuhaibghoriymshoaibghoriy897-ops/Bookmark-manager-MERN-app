export const notFoundHandler = (req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Central error handler -> always responds with { success: false, message }
export const errorHandler = (err, req, res, next) => {
  // Mongoose validation errors (required, match, maxlength...)
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ success: false, message });
  }

  // Bad ObjectId etc.
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid value provided" });
  }

  // Malformed JSON body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
};
