// middleware/errorHandler.js
// Centralized error handling middleware

/**
 * Development error handler - shows stack trace
 */
function developmentErrorHandler(err, req, res, next) {
  console.error('Error:', err);

  res.status(err.status || 500);

  // If it's an API request, send JSON
  if (req.path.startsWith('/api/')) {
    res.json({
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // For page requests, render error page
    res.render('error', {
      message: err.message,
      error: err
    });
  }
}

/**
 * Production error handler - no stack trace leaked to user
 */
function productionErrorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  res.status(err.status || 500);

  // If it's an API request, send JSON
  if (req.path.startsWith('/api/')) {
    res.json({
      message: err.message || 'Something went wrong'
    });
  } else {
    // For page requests, render error page
    res.render('error', {
      message: err.message || 'Something went wrong',
      error: {}  // Don't leak error details
    });
  }
}

/**
 * Export the appropriate error handler based on environment
 */
module.exports = process.env.NODE_ENV === 'production'
  ? productionErrorHandler
  : developmentErrorHandler;
