// routes/pageRoutes.js
const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('../middleware/auth');

// Public pages
router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Welcome to Q-Unit' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Login' });
});

router.get('/signup', (req, res) => {
  res.render('pages/signup', { title: 'Sign Up' });
});

// Protected pages
router.get('/quiz', ensureLoggedIn, (req, res) => {
  res.render('pages/quiz', { title: 'Quiz Time' });
});

router.get('/results', ensureLoggedIn, (req, res) => {
  res.render('pages/results', { title: 'Your Results' });
});

router.get('/profile', ensureLoggedIn, (req, res) => {
  res.render('pages/profile', { title: 'Your Profile' });
});

router.get('/leaderboard', ensureLoggedIn, (req, res) => {
  res.render('pages/leaderboard', { title: 'Leaderboard' });
});

module.exports = router;
