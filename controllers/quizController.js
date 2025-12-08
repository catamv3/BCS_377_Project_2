// controllers/quizController.js
// This file contains all quiz-related business logic

const User = require('../models/User');
const GameSession = require('../models/GameSession');
const { fetchTriviaQuestions } = require('../services/triviaApi');

// Load local questions as fallback
const localQuestions = require('../data/questions.json');

// Store active quizzes in memory
// In production, you'd use Redis or database for this
const activeQuizzes = new Map();

/**
 * Helper: Shuffle array using Fisher-Yates algorithm
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Fallback: Get questions from local JSON file
 */
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

/**
 * Generate a new quiz
 * POST /api/quiz/new
 */
exports.createQuiz = async (req, res, next) => {
  try {
    const { amount = 10, category, difficulty } = req.body;
    const user = await User.findById(req.session.userId);

    let questions;

    try {
      // Try to fetch questions from Trivia API
      questions = await fetchTriviaQuestions(amount, category, difficulty);
      console.log(`Fetched ${questions.length} questions from Trivia API`);
    } catch (apiError) {
      console.error('Trivia API failed, using local questions:', apiError.message);
      // Fallback to local questions
      questions = getLocalQuestions(amount);
    }

    // Store questions in session for answer validation
    const quizId = `${user._id}_${Date.now()}`;
    activeQuizzes.set(quizId, questions);

    // Clean up old quizzes (older than 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    for (const [key] of activeQuizzes.entries()) {
      const timestamp = parseInt(key.split('_')[1]);
      if (timestamp < oneHourAgo) {
        activeQuizzes.delete(key);
      }
    }

    await user.save();

    // Send questions to client (without correct answers!)
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

/**
 * Submit quiz answers and calculate score
 * POST /api/quiz/submit
 */
exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    // answers format: [{ id, chosenAnswer }, ...]

    // Retrieve the stored questions for this quiz
    const questions = activeQuizzes.get(quizId);

    if (!questions) {
      return res.status(400).json({
        message: 'Quiz not found or expired'
      });
    }

    // Calculate score and build detailed results
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

    // Clean up the quiz from memory
    activeQuizzes.delete(quizId);

    // Save game session to database
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
