// middleware/auth.js

// Simple middleware to require a logged-in user using session
module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();
};
