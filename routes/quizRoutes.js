// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

router.post('/new', requireAuth, quizController.createQuiz);
router.post('/submit', requireAuth, quizController.submitQuiz);

module.exports = router;
