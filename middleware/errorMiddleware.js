// middleware/errorMiddleware.js

/**
 * Centralized error handling middleware for Express.
 * This middleware catches all errors passed to next() and sends a structured JSON response.
 * It also prevents leaking sensitive stack traces in a production environment.
 */
const errorHandler = (err, req, res, next) => {
    // 1. Determine the status code.
    // If the error object already has a statusCode, use it.
    // Otherwise, if the response object has a statusCode (e.g., set before throwing the error), use that.
    // If neither, default to 500 (Internal Server Error).
    let statusCode = err.statusCode || res.statusCode || 500;

    // For certain types of Mongoose errors (e.g., CastError for a malformed ObjectId), a 404 is more appropriate.
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        err.message = 'Resource not found';
    }

    // 2. Log the error for debugging purposes.
    // This helps you see what's going wrong on the server during development.
    console.error(err.stack);

    // 3. Send a structured error response to the client.
    res.status(statusCode).json({
        success: false,
        error: err.message,
        // 4. IMPORTANT: Include the stack trace only in development mode for security reasons.
        // The stack trace can contain sensitive information about your server's file structure.
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

export default errorHandler;