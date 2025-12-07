// services/triviaApi.js
const axios = require('axios');

/**
 * Fetches trivia questions from the Open Trivia Database API
 * @param {number} amount - Number of questions to fetch (default: 10)
 * @param {number} category - Category ID (optional)
 * @param {string} difficulty - Difficulty level: easy, medium, hard (optional)
 * @returns {Promise<Array>} Array of formatted questions
 */
async function fetchTriviaQuestions(amount = 10, category = null, difficulty = null) {
  try {
    // Build API URL
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;

    if (category) {
      apiUrl += `&category=${category}`;
    }

    if (difficulty) {
      apiUrl += `&difficulty=${difficulty}`;
    }

    // Fetch questions from API
    const response = await axios.get(apiUrl);

    if (response.data.response_code !== 0) {
      throw new Error(`API returned error code: ${response.data.response_code}`);
    }

    // Format questions to match our app's format
    const formattedQuestions = response.data.results.map((q, index) => {
      // Decode HTML entities
      const question = decodeHtml(q.question);
      const correctAnswer = decodeHtml(q.correct_answer);
      const incorrectAnswers = q.incorrect_answers.map(ans => decodeHtml(ans));

      // Combine and shuffle answers
      const allAnswers = [correctAnswer, ...incorrectAnswers];
      const shuffledAnswers = shuffleArray([...allAnswers]);

      // Find which option (A, B, C, D) has the correct answer
      const correctOption = ['A', 'B', 'C', 'D'][shuffledAnswers.indexOf(correctAnswer)];

      return {
        id: index,
        question: question,
        A: shuffledAnswers[0] || '',
        B: shuffledAnswers[1] || '',
        C: shuffledAnswers[2] || '',
        D: shuffledAnswers[3] || '',
        answer: correctOption,
        category: q.category,
        difficulty: q.difficulty
      };
    });

    return formattedQuestions;
  } catch (error) {
    console.error('Error fetching trivia questions:', error.message);
    throw error;
  }
}

/**
 * Decode HTML entities (e.g., &quot; to ")
 */
function decodeHtml(html) {
  const entities = {
    '&quot;': '"',
    '&#039;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ndash;': '-',
    '&mdash;': '-',
    '&nbsp;': ' '
  };

  return html.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get available categories from the API
 */
async function getCategories() {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    return response.data.trivia_categories;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
}

module.exports = {
  fetchTriviaQuestions,
  getCategories
};
