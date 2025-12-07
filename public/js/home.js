// public/js/home.js

async function loadHomeStats() {
  const statsEl = document.getElementById('heroStats');
  if (!statsEl) return;

  // Optional: could fetch some quick stats from custom endpoint later.
  // For now we just show static text.
  statsEl.innerHTML = `
    <div>✓ Play 10-question quizzes</div>
    <div>✓ Track your play history</div>
    <div>✓ Compete on the global leaderboard</div>
  `;
}

document.addEventListener('DOMContentLoaded', loadHomeStats);
