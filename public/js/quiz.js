// public/js/quiz.js

let questions = [];
let quizStartTime = null;
let quizTimerInterval = null;
const QUIZ_TIME_LIMIT_SECONDS = 60; // whole quiz timer (optional extra)

function updateTimer() {
  const timerEl = document.getElementById('quizTimer');
  if (!timerEl || !quizStartTime) return;

  const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
  const remaining = Math.max(0, QUIZ_TIME_LIMIT_SECONDS - elapsed);

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  timerEl.textContent = `Time remaining: ${mins}:${secs}`;

  if (remaining <= 0) {
    clearInterval(quizTimerInterval);
    alert('Time is up! Submitting your quiz.');
    submitQuiz();
  }
}

async function loadQuiz() {
  const container = document.getElementById('quizContainer');
  container.innerHTML = '<p>Loading quiz...</p>';

  try {
    const res = await fetch('/api/quiz/new', { method: 'POST' });

    if (res.status === 401) {
      alert('You must be logged in to play.');
      window.location.href = '/login';
      return;
    }

    if (!res.ok) {
      container.innerHTML = '<p>Could not load quiz.</p>';
      return;
    }

    questions = await res.json();
    renderQuiz();

    // Start timer
    quizStartTime = Date.now();
    quizTimerInterval = setInterval(updateTimer, 1000);
    updateTimer();
  } catch (err) {
    container.innerHTML = '<p>Error loading quiz.</p>';
  }
}

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  container.innerHTML = '';

  questions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';

    div.innerHTML = `
      <div class="quiz-question-title">
        Q${idx + 1}. ${q.question}
      </div>
      <div class="quiz-options">
        ${Object.entries(q.options).map(([letter, text]) => `
          <label>
            <input type="radio" name="q${idx}" value="${letter}">
            <span class="chip">${letter}</span> ${text}
          </label>
        `).join('')}
      </div>
    `;

    container.appendChild(div);
  });
}

async function submitQuiz() {
  const submitBtn = document.getElementById('submitQuiz');
  submitBtn.disabled = true;

  const answers = questions.map((q, idx) => {
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    return {
      id: q.id,
      chosenAnswer: selected ? selected.value : null
    };
  });

  try {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });

    const data = await res.json();
    if (res.ok) {
      // Stop timer
      if (quizTimerInterval) clearInterval(quizTimerInterval);
      const params = new URLSearchParams({
        score: data.score,
        total: data.total
      });
      window.location.href = `/results?${params.toString()}`;
    } else if (res.status === 401) {
      alert('You must be logged in.');
      window.location.href = '/login';
    } else {
      alert(data.message || 'Error submitting quiz');
      submitBtn.disabled = false;
    }
  } catch (err) {
    alert('Network error submitting quiz');
    submitBtn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitQuiz');
  if (submitBtn) submitBtn.addEventListener('click', submitQuiz);
  if (document.getElementById('quizContainer')) loadQuiz();
});
