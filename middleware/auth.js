// middleware/auth.js

// Check if user is logged in (for API routes)
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();
}

// Check if user is logged in (for page routes)
function ensureLoggedIn(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

module.exports = { requireAuth, ensureLoggedIn };
