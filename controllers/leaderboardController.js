// controllers/leaderboardController.js
// This file contains leaderboard-related business logic

const GameSession = require('../models/GameSession');

/**
 * Get top 10 players by best score
 * GET /api/leaderboard/top
 */
exports.getTopPlayers = async (req, res, next) => {
  try {
    // MongoDB aggregation pipeline to get top players
    const agg = await GameSession.aggregate([
      // Group by user, get their best score and total games
      {
        $group: {
          _id: '$user',
          bestScore: { $max: '$score' },
          gamesPlayed: { $sum: 1 }
        }
      },
      // Sort by best score (highest first)
      { $sort: { bestScore: -1 } },
      // Only get top 10
      { $limit: 10 },
      // Join with users collection to get username
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      // Flatten the user array
      { $unwind: '$user' },
      // Format the output
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
