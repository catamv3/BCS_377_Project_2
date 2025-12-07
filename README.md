# Q-Unit - Quiz Application

A full-stack web application that allows users to test their knowledge through interactive quizzes, track their progress, and compete on a leaderboard.

## 🎯 Project Overview

Q-Unit is a quiz application built using the client-server architecture. The server manages question selection, game logic, score tracking, and serves the HTML/CSS/JS files. Users can create accounts, take 10-question quizzes, view their play history, and see how they rank against other players.

## 👥 Team Members

- **Michael Catalanotti** - Full Stack Developer
  - Implemented authentication system (signup/login)
  - Designed and developed MongoDB schemas (User, GameSession models)
  - Created server-side routing and API endpoints
  - Built user profile page with play history
  - Implemented quiz question selection algorithm
  - Designed and styled the frontend UI

## ✨ Features Implemented

### Main Features (Required)

1. **Landing Page** - Clean welcome screen with login/register options
2. **Authentication System**
   - User signup with email and password
   - Secure login with bcrypt password hashing
   - Session-based authentication
3. **Quiz Page** - Interactive 10-question quiz with:
   - Multiple choice questions (A, B, C, D options)
   - Radio button selection
   - Timer functionality (60 seconds for entire quiz)
   - Submit functionality
4. **Results Page** - Displays score and percentage after quiz completion
5. **User Profile Page** - Shows:
   - User information (username, email, join date)
   - Complete play history with scores and dates
   - Navigation buttons to quiz and leaderboard
6. **Leaderboard** - Displays top 10 players ranked by best score
7. **MongoDB Integration**
   - User data storage
   - Game session tracking
   - Score history

### Extra Features (Optional)

1. ✅ **Quiz Timer** - 60-second countdown for the entire quiz
2. ✅ **Smart Question Selection** - Algorithm prevents users from getting the same questions repeatedly
3. ✅ **Play Again** - Users can retake quizzes unlimited times

### Technical Features

- **Secure Authentication** - Password hashing with bcrypt
- **Session Management** - Express sessions for user state
- **Protected Routes** - Middleware to ensure authenticated access
- **RESTful API** - Clean API endpoints for all operations
- **Responsive Design** - Works on desktop and mobile devices
- **Modern UI** - Custom gradient design with teal/cyan color scheme

## 🏗️ Project Structure

```
BCS_377_Project_2/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── data/
│   └── questions.json        # Quiz questions database
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User schema (username, email, password)
│   └── GameSession.js       # Game session schema (score, questions)
├── public/
│   ├── css/
│   │   └── style.css        # Application styles
│   ├── js/
│   │   ├── auth.js          # Signup/login functionality
│   │   ├── common.js        # Shared utilities
│   │   ├── home.js          # Landing page logic
│   │   ├── leaderboard.js   # Leaderboard functionality
│   │   ├── profile.js       # Profile page logic
│   │   ├── quiz.js          # Quiz functionality
│   │   └── results.js       # Results page logic
│   ├── index.html           # Landing page
│   ├── login.html           # Login page
│   ├── signup.html          # Signup page
│   ├── quiz.html            # Quiz page
│   ├── results.html         # Results page
│   ├── profile.html         # User profile page
│   └── leaderboard.html     # Leaderboard page
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── quizRoutes.js        # Quiz endpoints
│   ├── userRoutes.js        # User data endpoints
│   └── leaderboardRoutes.js # Leaderboard endpoints
├── server.js                # Express server setup
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## 🚀 How to Run the Server

### Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- npm (comes with Node.js)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BCS_377_Project_2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with:
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/bcs377project2
   SESSION_SECRET=your_secret_key_here
   ```

4. **Start MongoDB**

   If using local MongoDB:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # Or start manually
   mongod --config /opt/homebrew/etc/mongod.conf
   ```

5. **Run the server**

   For development (with auto-restart):
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

6. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing
- **express-session** - Session management
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (custom design, gradients, animations)
- **Vanilla JavaScript** - Interactivity
- **Fetch API** - HTTP requests

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Quiz
- `POST /api/quiz/new` - Get 10 random questions (requires auth)
- `POST /api/quiz/submit` - Submit quiz answers (requires auth)

### User
- `GET /api/user/me` - Get current user info (requires auth)
- `GET /api/user/me/history` - Get user's quiz history (requires auth)

### Leaderboard
- `GET /api/leaderboard/top` - Get top 10 players

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  passwordHash: String (required),
  recentQuestionIndexes: [Number],
  timestamps: true
}
```

### GameSession Model
```javascript
{
  user: ObjectId (ref: User, required),
  score: Number (required),
  total: Number (default: 10),
  questions: [{
    index: Number,
    question: String,
    chosenAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  timestamps: true
}
```

## 🎮 How to Use the Application

1. **Sign Up** - Create a new account with username, email, and password
2. **Login** - Enter your credentials to access the app
3. **Take Quiz** - Click "Take Quiz" to start a 10-question quiz
4. **Answer Questions** - Select answers for all questions before time runs out
5. **Submit** - Click "Submit Quiz" to see your results
6. **View Results** - See your score and percentage
7. **Check Profile** - View your complete quiz history
8. **Leaderboard** - See how you rank against other players

## 🚢 Deployment

### Deploy to Render

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Choose "Node" as the environment
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables** in Render dashboard:
   ```
   MONGO_URI=<your-mongodb-atlas-uri>
   SESSION_SECRET=<random-secret-string>
   PORT=3000
   ```

4. **Deploy** - Render will automatically build and deploy your app

### MongoDB Atlas Setup (for cloud database)

1. Create account at https://mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and add to Render environment variables

## 🔮 Future Enhancements (Phase 2)

- [ ] Replace hardcoded questions with Trivia API (https://opentdb.com)
- [ ] Add difficulty selection
- [ ] Allow users to choose number of questions
- [ ] Category selection for quizzes
- [ ] Add sound effects
- [ ] Dark/light theme toggle

## 📚 Learning Resources Used

- Express.js Documentation
- MongoDB/Mongoose Documentation
- MDN Web Docs (JavaScript, HTML, CSS)
- Stack Overflow for troubleshooting
- ChatGPT for code explanations and debugging

## 🐛 Known Issues

- None currently reported

## 📄 License

This project was created as part of BCS377 - Intro to Web Development course.

## 🙏 Acknowledgments

- Professor for project guidelines and requirements
- Trivia questions database
- MongoDB Atlas for cloud database hosting
- Render for free hosting service
