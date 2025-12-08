// controllers/authController.js
// This file contains all authentication-related business logic
// Following the MVC (Model-View-Controller) pattern

const User = require('../models/User');

/**
 * Handle user signup
 * POST /api/auth/signup
 */
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({
        message: 'Username or email already in use'
      });
    }

    // Create new user
    const user = new User({ username, email });
    await user.setPassword(password);
    await user.save();

    // Create session
    req.session.userId = user._id;

    res.json({
      message: 'Signup successful',
      username: user.username
    });
  } catch (err) {
    next(err); // Pass error to error handler middleware
  }
};

/**
 * Handle user login
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user._id;

    res.json({
      message: 'Login successful',
      username: user.username
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle user logout
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out' });
  });
};
