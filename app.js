// app.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

// Connect DB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Share auth state with templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = Boolean(req.session?.userId);
  next();
});

// Rendered pages
app.use('/', pageRoutes);

// Serve static files (frontend assets like CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Fallback: basic 404 page
app.use((req, res) => {
  res.status(404).render('pages/not-found', { title: 'Page Not Found' });
});

module.exports = app;
