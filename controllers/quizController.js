// controllers/quizController.js
const User = require('../models/User');
const GameSession = require('../models/GameSession');
const { fetchTriviaQuestions } = require('../services/triviaApi');
const localQuestions = require('../data/questions.json');

// Store active quizzes in memory
const activeQuizzes = new Map();

// Shuffle array helper
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Get questions from local file
function getLocalQuestions(count = 10) {
  const indexes = [...Array(localQuestions.length).keys()];
  shuffle(indexes);
  const chosen = indexes.slice(0, count);

  return chosen.map(i => {
    const q = localQuestions[i];
    return {
      id: i,
      question: q.question,
      A: q.A,
      B: q.B,
      C: q.C,
      D: q.D,
      answer: q.answer
    };
  });
}

// Create new quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const { amount = 10, category, difficulty } = req.body;
    const user = await User.findById(req.session.userId);

    let questions;

    try {
      // Try Trivia API first
      questions = await fetchTriviaQuestions(amount, category, difficulty);
    } catch (apiError) {
      // Fallback to local questions if API fails
      questions = getLocalQuestions(amount);
    }

    // Store questions for validation later
    const quizId = `${user._id}_${Date.now()}`;
    activeQuizzes.set(quizId, questions);

    // Clean up old quizzes
    const oneHourAgo = Date.now() - 3600000;
    for (const [key] of activeQuizzes.entries()) {
      const timestamp = parseInt(key.split('_')[1]);
      if (timestamp < oneHourAgo) {
        activeQuizzes.delete(key);
      }
    }

    await user.save();

    // Send questions without answers
    const payload = questions.map((q, index) => ({
      id: index,
      question: q.question,
      options: {
        A: q.A,
        B: q.B,
        C: q.C,
        D: q.D
      },
      category: q.category,
      difficulty: q.difficulty
    }));

    res.json({ quizId, questions: payload });
  } catch (err) {
    next(err);
  }
};

// Submit quiz
exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;

    const questions = activeQuizzes.get(quizId);
    if (!questions) {
      return res.status(400).json({ message: 'Quiz not found or expired' });
    }

    // Calculate score
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

    activeQuizzes.delete(quizId);

    // Save to database
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
    next(err);
  }
};
