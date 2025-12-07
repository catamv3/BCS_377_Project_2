// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const GameSession = require('../models/GameSession');

// Load local questions
const questions = require('../data/questions.json');

// Helper: shuffle array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// pick 10 question indexes, avoiding recent ones
function getQuestionIndexesForUser(user, count = 10) {
  const total = questions.length;
  const recentSet = new Set(user.recentQuestionIndexes || []);
  const fresh = [];

  for (let i = 0; i < total; i++) {
    if (!recentSet.has(i)) fresh.push(i);
  }

  shuffle(fresh);

  let chosen = fresh.slice(0, count);

  if (chosen.length < count) {
    const all = [...Array(total).keys()];
    shuffle(all);
    const needed = count - chosen.length;
    const fill = all.filter(i => !chosen.includes(i)).slice(0, needed);
    chosen = chosen.concat(fill);
  }

  user.recentQuestionIndexes = [...chosen, ...(user.recentQuestionIndexes || [])].slice(0, 30);

  return chosen;
}

// POST /api/quiz/new
router.post('/new', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const indexes = getQuestionIndexesForUser(user, 10);

    await user.save();

    const payload = indexes.map(i => {
      const q = questions[i];
      return {
        id: i,
        question: q.question,
        options: {
          A: q.A,
          B: q.B,
          C: q.C,
          D: q.D
        }
      };
    });

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating quiz' });
  }
});

// POST /api/quiz/submit
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { answers } = req.body;
    // answers: [{ id, chosenAnswer }, ...]

    let score = 0;
    const detail = answers.map(ans => {
      const q = questions[ans.id];
      const isCorrect = ans.chosenAnswer === q.answer;
      if (isCorrect) score++;

      return {
        index: ans.id,
        question: q.question,
        chosenAnswer: ans.chosenAnswer,
        correctAnswer: q.answer,
        isCorrect
      };
    });

    const game = await GameSession.create({
      user: req.session.userId,
      score,
      total: answers.length,
      questions: detail
    });

    res.json({
      score,
      total: answers.length,
      gameId: game._id,
      questions: detail
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

module.exports = router;
