// routes/quizRoutes.js
// This file defines the quiz routes
// Business logic is in controllers/quizController.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// POST /api/quiz/new - Generate a new quiz (protected route)
router.post('/new', requireAuth, quizController.createQuiz);

// POST /api/quiz/submit - Submit quiz answers (protected route)
router.post('/submit', requireAuth, quizController.submitQuiz);

module.exports = router;
