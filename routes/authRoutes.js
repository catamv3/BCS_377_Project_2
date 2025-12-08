// routes/authRoutes.js
// This file defines the authentication routes
// Business logic is in controllers/authController.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signup - Create new user account
router.post('/signup', authController.signup);

// POST /api/auth/login - User login
router.post('/login', authController.login);

// POST /api/auth/logout - User logout
router.post('/logout', authController.logout);

module.exports = router;
