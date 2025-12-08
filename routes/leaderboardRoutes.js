// routes/leaderboardRoutes.js
// This file defines the leaderboard routes
// Business logic is in controllers/leaderboardController.js

const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// GET /api/leaderboard/top - Get top 10 players
router.get('/top', leaderboardController.getTopPlayers);

module.exports = router;
