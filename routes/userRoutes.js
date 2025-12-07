// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const GameSession = require('../models/GameSession');

// GET /api/user/me
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.session.userId).select('username email createdAt');
  res.json(user);
});

// GET /api/user/me/history
router.get('/me/history', requireAuth, async (req, res) => {
  const games = await GameSession.find({ user: req.session.userId })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(games);
});

module.exports = router;
