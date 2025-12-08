// controllers/leaderboardController.js
const GameSession = require('../models/GameSession');

// Get top 10 players
exports.getTopPlayers = async (req, res, next) => {
  try {
    const agg = await GameSession.aggregate([
      {
        $group: {
          _id: '$user',
          bestScore: { $max: '$score' },
          gamesPlayed: { $sum: 1 }
        }
      },
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
    next(err);
  }
};
