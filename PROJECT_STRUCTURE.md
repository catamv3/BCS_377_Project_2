# Express Generator Project Structure Guide

## For BCS 377 Students - Understanding Your Quiz Application

This document explains how your project is organized following **Express Generator** conventions and the **MVC (Model-View-Controller) pattern**. Understanding this structure will help you build better web applications!

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [MVC Pattern Explained](#mvc-pattern-explained)
4. [How Everything Connects](#how-everything-connects)
5. [Adding New Features](#adding-new-features)

---

## Project Overview

Your quiz application follows a professional structure that separates concerns:

- **Models** - Define database schemas (User, GameSession)
- **Views** - EJS templates that render HTML
- **Controllers** - Business logic for handling requests
- **Routes** - URL endpoint definitions
- **Middleware** - Functions that run between request and response
- **Utils** - Reusable helper functions

This is called the **MVC Pattern** - an industry-standard way to organize web applications.

---

## Folder Structure

```
BCS_377_Project_2/
│
├── bin/
│   └── www                    # Server startup file
│
├── config/
│   └── db.js                  # MongoDB connection
│
├── controllers/               # ✨ NEW! Business logic
│   ├── authController.js      # Signup, login, logout logic
│   ├── quizController.js      # Quiz generation & submission
│   ├── userController.js      # User profile & history
│   └── leaderboardController.js
│
├── data/
│   └── questions.json         # Local quiz questions
│
├── middleware/                # Functions that run before routes
│   ├── auth.js               # Authentication checks
│   └── errorHandler.js       # ✨ NEW! Error handling
│
├── models/                    # Database schemas
│   ├── User.js               # User model
│   └── GameSession.js        # Game session model
│
├── public/                    # Static files (CSS, JS, images)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js           # Frontend login/signup
│   │   ├── quiz.js           # Frontend quiz logic
│   │   ├── profile.js        # Frontend profile page
│   │   └── ...
│   └── node.png
│
├── routes/                    # URL endpoint definitions
│   ├── authRoutes.js         # /api/auth/* endpoints
│   ├── quizRoutes.js         # /api/quiz/* endpoints
│   ├── userRoutes.js         # /api/user/* endpoints
│   ├── leaderboardRoutes.js  # /api/leaderboard/* endpoints
│   └── pageRoutes.js         # Page rendering routes
│
├── services/
│   └── triviaApi.js          # External API integration
│
├── utils/                     # ✨ NEW! Helper utilities
│   ├── logger.js             # Colored console logging
│   └── responses.js          # Standardized API responses
│
├── views/                     # EJS templates
│   ├── pages/
│   │   ├── home.ejs
│   │   ├── login.ejs
│   │   ├── quiz.ejs
│   │   └── ...
│   └── partials/
│       ├── head.ejs
│       └── nav.ejs
│
├── app.js                     # Main Express app configuration
├── package.json               # Dependencies
├── .env                       # Environment variables
└── .gitignore                # Git ignore rules
```

---

## MVC Pattern Explained

### What is MVC?

**MVC (Model-View-Controller)** is a design pattern that separates your application into three parts:

#### 1. **Model** (Data Layer)
- Located in: `models/`
- Purpose: Define how data is structured in the database
- Example: `User.js` defines username, email, passwordHash

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String
});
```

#### 2. **View** (Presentation Layer)
- Located in: `views/`
- Purpose: HTML templates that show data to users
- Example: `quiz.ejs` displays quiz questions

```html
<!-- views/pages/quiz.ejs -->
<h1>Quiz Time!</h1>
<% questions.forEach(q => { %>
  <p><%= q.question %></p>
<% }); %>
```

#### 3. **Controller** (Logic Layer)
- Located in: `controllers/`
- Purpose: Handle business logic and data processing
- Example: `quizController.js` creates quizzes and calculates scores

```javascript
// controllers/quizController.js
exports.createQuiz = async (req, res, next) => {
  // Get questions from API
  // Store in memory
  // Send to client
};
```

### Why Use MVC?

✅ **Organized** - Easy to find code
✅ **Maintainable** - Changes are isolated
✅ **Scalable** - Easy to add features
✅ **Team-friendly** - Multiple people can work together
✅ **Professional** - Industry standard

---

## How Everything Connects

### Request Flow (Step-by-Step)

Let's trace what happens when a user takes a quiz:

```
User clicks "Start Quiz"
    ↓
1. Browser sends: POST /api/quiz/new
    ↓
2. app.js receives request
    ↓
3. Middleware runs:
   - express.json() parses request body
   - session middleware checks for userId
    ↓
4. Route matches: routes/quizRoutes.js
   router.post('/new', requireAuth, quizController.createQuiz)
    ↓
5. Middleware: requireAuth checks if user is logged in
    ↓
6. Controller: quizController.createQuiz runs
   - Fetches questions from Trivia API
   - Stores questions in memory
   - Sends questions to client (without answers!)
    ↓
7. Response sent back to browser
    ↓
8. Frontend JS (public/js/quiz.js) displays questions
```

### File Relationships

```
┌─────────────┐
│  bin/www    │ ← Starts the server
│             │
│  requires   │
│     ↓       │
│  app.js     │ ← Configures Express
└─────────────┘
      ↓
  Loads Routes
      ↓
┌─────────────┐
│ Routes      │ ← Define URLs
│ /routes/*   │
└─────────────┘
      ↓
  Uses Controllers
      ↓
┌─────────────┐
│ Controllers │ ← Business logic
│ /controllers│
└─────────────┘
      ↓
  Uses Models
      ↓
┌─────────────┐
│ Models      │ ← Database
│ /models/*   │
└─────────────┘
```

---

## Adding New Features

### Example: Add a "Favorites" Feature

Follow these steps to add a new feature professionally:

#### 1. **Update Model** (Database)

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  favoriteQuestions: [Number]  // ← ADD THIS
});
```

#### 2. **Create Controller** (Business Logic)

```javascript
// controllers/favoritesController.js
const User = require('../models/User');

exports.addFavorite = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    const user = await User.findById(req.session.userId);

    user.favoriteQuestions.push(questionId);
    await user.save();

    res.json({ message: 'Added to favorites' });
  } catch (err) {
    next(err);
  }
};
```

#### 3. **Create Routes** (URLs)

```javascript
// routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const favoritesController = require('../controllers/favoritesController');

router.post('/add', requireAuth, favoritesController.addFavorite);

module.exports = router;
```

#### 4. **Register Routes in app.js**

```javascript
// app.js
const favoriteRoutes = require('./routes/favoriteRoutes');

// ... other routes ...
app.use('/api/favorites', favoriteRoutes);
```

#### 5. **Create Frontend** (User Interface)

```javascript
// public/js/favorites.js
async function addToFavorites(questionId) {
  const response = await fetch('/api/favorites/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId })
  });

  const data = await response.json();
  console.log(data.message);
}
```

---

## Quick Reference

### Common Tasks

**Run the server:**
```bash
npm run dev          # Development (auto-restart)
npm start            # Production
```

**Database:**
```bash
# Start MongoDB locally
brew services start mongodb-community
```

**Check structure:**
```bash
tree -L 2 -I 'node_modules'
```

---

## Key Concepts for Students

### Routes vs Controllers

**Routes** = "WHAT" (which URL)
```javascript
// routes/quizRoutes.js
router.post('/new', requireAuth, quizController.createQuiz);
//           ↑        ↑            ↑
//         URL    Middleware   Controller
```

**Controllers** = "HOW" (what to do)
```javascript
// controllers/quizController.js
exports.createQuiz = async (req, res, next) => {
  // Actual logic here
};
```

### Middleware

Think of middleware as **checkpoints** between request and response:

```
Request → Middleware 1 → Middleware 2 → Route → Response
          (check auth)   (parse JSON)
```

Example:
```javascript
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();  // ← Pass to next function
}
```

### Error Handling

Instead of try-catch everywhere, use `next(err)`:

```javascript
exports.createQuiz = async (req, res, next) => {
  try {
    // Your code
  } catch (err) {
    next(err);  // ← Pass to error handler
  }
};
```

The error handler in `middleware/errorHandler.js` catches all errors!

---

## Best Practices

✅ **DO:**
- Keep controllers focused (one responsibility)
- Use meaningful variable names
- Add comments for complex logic
- Use environment variables for secrets
- Validate user input

❌ **DON'T:**
- Put business logic in routes
- Hardcode passwords or secrets
- Mix HTML and JavaScript logic
- Forget error handling
- Leave console.logs in production

---

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [EJS Documentation](https://ejs.co/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## Questions?

This structure might seem complex at first, but it makes building large applications much easier. Each file has ONE job, making your code:

- **Easier to debug** (know where to look)
- **Easier to test** (isolated functions)
- **Easier to extend** (add features without breaking others)

Happy coding! 🚀
