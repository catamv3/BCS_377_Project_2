// utils/responses.js
// Standardized API response helpers

/**
 * Send success response
 */
function success(res, data, message = 'Success', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Send error response
 */
function error(res, message = 'Error', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
}

/**
 * Send validation error response
 */
function validationError(res, errors) {
  error(res, 'Validation failed', 400, errors);
}

/**
 * Send unauthorized response
 */
function unauthorized(res, message = 'Unauthorized') {
  error(res, message, 401);
}

/**
 * Send not found response
 */
function notFound(res, message = 'Resource not found') {
  error(res, message, 404);
}

module.exports = {
  success,
  error,
  validationError,
  unauthorized,
  notFound
};
