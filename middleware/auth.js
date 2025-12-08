// middleware/auth.js
// Authentication middleware for protecting routes

/**
 * Middleware for API routes
 * Returns JSON response if user is not authenticated
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();
}

/**
 * Middleware for page routes
 * Redirects to login page if user is not authenticated
 */
function ensureLoggedIn(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

module.exports = {
  requireAuth,      // Use for API endpoints
  ensureLoggedIn    // Use for rendered pages
};
