// routes/userRoutes.js
// This file defines the user-related routes
// Business logic is in controllers/userController.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const userController = require('../controllers/userController');

// GET /api/user/me - Get current user profile (protected route)
router.get('/me', requireAuth, userController.getCurrentUser);

// GET /api/user/me/history - Get user's quiz history (protected route)
router.get('/me/history', requireAuth, userController.getUserHistory);

module.exports = router;
