// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const GameSession = require('../models/GameSession');

router.get('/top', async (req, res) => {
  try {
    const agg = await GameSession.aggregate([
      { $group: { _id: '$user', bestScore: { $max: '$score' }, gamesPlayed: { $sum: 1 } } },
      { $sort: { bestScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          bestScore: 1,
          gamesPlayed: 1
        }
      }
    ]);

    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting leaderboard' });
  }
});

module.exports = router;
