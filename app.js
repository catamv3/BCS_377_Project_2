// app.js
// Main Express application setup
// This file configures middleware, routes, and error handling

// Load environment variables from .env file
require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

// Database configuration
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const pageRoutes = require('./routes/pageRoutes');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();

// ===== DATABASE CONNECTION =====
connectDB();

// ===== VIEW ENGINE SETUP =====
// Use EJS for server-side rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== MIDDLEWARE CONFIGURATION =====

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

// Make authentication state available to all EJS templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = Boolean(req.session?.userId);
  next();
});

// ===== ROUTES =====

// Serve static files (CSS, JS, images) from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Page routes (render HTML views)
app.use('/', pageRoutes);

// API routes (return JSON)
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ===== ERROR HANDLING =====

// 404 handler - catch all undefined routes
app.use((req, res, next) => {
  res.status(404);

  // If it's an API request, return JSON
  if (req.path.startsWith('/api/')) {
    res.json({ message: 'API endpoint not found' });
  } else {
    // Otherwise render 404 page
    res.render('pages/not-found', { title: 'Page Not Found' });
  }
});

// Global error handler
app.use(errorHandler);

// Export app for use in bin/www
module.exports = app;
