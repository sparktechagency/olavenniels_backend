// middleware/errorHandler.js
// This file is used to handle errors

const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  };
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: "error",
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };
  
  module.exports = { notFoundHandler, errorHandler };
  