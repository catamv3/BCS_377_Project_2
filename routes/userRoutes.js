// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/me', requireAuth, userController.getCurrentUser);
router.get('/me/history', requireAuth, userController.getUserHistory);

module.exports = router;
