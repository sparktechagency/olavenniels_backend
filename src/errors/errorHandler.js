// errors/errorHandler.js
class ApiError extends Error {
    /**
     * Creates an API Error instance
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code (default: 500)
     */
    constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Identify expected (handled) errors
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = { ApiError };
  