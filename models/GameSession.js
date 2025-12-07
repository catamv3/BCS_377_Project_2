// models/GameSession.js
const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  total: { type: Number, default: 10 },
  questions: [{
    index: Number,
    question: String,
    chosenAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.model('GameSession', gameSessionSchema);
