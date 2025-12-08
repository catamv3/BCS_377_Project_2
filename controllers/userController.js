// controllers/userController.js
const User = require('../models/User');
const GameSession = require('../models/GameSession');

// Get current user
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

// Get user's quiz history
exports.getUserHistory = async (req, res, next) => {
  try {
    const games = await GameSession.find({ user: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(games);
  } catch (err) {
    next(err);
  }
};
