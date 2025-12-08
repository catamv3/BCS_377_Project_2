// controllers/userController.js
// This file contains all user-related business logic

const User = require('../models/User');
const GameSession = require('../models/GameSession');

/**
 * Get current user's profile
 * GET /api/user/me
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId)
      .select('username email createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user's quiz history
 * GET /api/user/me/history
 */
exports.getUserHistory = async (req, res, next) => {
  try {
    const games = await GameSession.find({ user: req.session.userId })
      .sort({ createdAt: -1 })  // Most recent first
      .limit(20);  // Last 20 games

    res.json(games);
  } catch (err) {
    next(err);
  }
};
