// public/js/profile.js

function getRankFromScore(totalScore) {
  if (totalScore >= 500) return 'Master';
  if (totalScore >= 300) return 'Expert';
  if (totalScore >= 150) return 'Advanced';
  if (totalScore >= 50) return 'Intermediate';
  return 'Beginner';
}

function getPerformanceClass(percent) {
  if (percent >= 90) return 'excellent';
  if (percent >= 70) return 'good';
  if (percent >= 50) return 'average';
  return 'poor';
}

async function loadProfile() {
  const infoEl = document.getElementById('profileInfo');
  const avatarEl = document.getElementById('profileAvatar');
  const statsGrid = document.getElementById('statsGrid');
  const historyContainer = document.getElementById('historyContainer');

  try {
    const [meRes, historyRes] = await Promise.all([
      fetch('/api/user/me'),
      fetch('/api/user/me/history')
    ]);

    if (meRes.status === 401 || historyRes.status === 401) {
      alert('You must be logged in to view your profile.');
      window.location.href = '/login';
      return;
    }

    const me = await meRes.json();
    const history = await historyRes.json();

    // Calculate stats
    const totalGames = history.length;
    const totalScore = history.reduce((sum, game) => sum + game.score, 0);
    const avgScore = totalGames > 0 ? (totalScore / totalGames).toFixed(1) : 0;
    const bestScore = totalGames > 0 ? Math.max(...history.map(g => g.score)) : 0;
    const avgPercent = totalGames > 0
      ? (history.reduce((sum, g) => sum + (g.score / g.total * 100), 0) / totalGames).toFixed(1)
      : 0;

    const rank = getRankFromScore(totalScore);

    // Update avatar with first letter
    avatarEl.textContent = me.username.charAt(0).toUpperCase();

    // Display user info
    infoEl.innerHTML = `
      <h1 class="profile-username">${me.username}</h1>
      <div class="profile-email">${me.email}</div>
      <div class="profile-rank">${rank}</div>
    `;

    // Display stats grid
    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Total Games</div>
        <div class="stat-value">${totalGames}</div>
        <div class="stat-subtext">Quizzes completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Score</div>
        <div class="stat-value">${avgScore}</div>
        <div class="stat-subtext">Out of 10 questions</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Best Score</div>
        <div class="stat-value">${bestScore}<span class="stat-denominator">/10</span></div>
        <div class="stat-subtext">Personal record</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Accuracy</div>
        <div class="stat-value">${avgPercent}%</div>
        <div class="stat-subtext">Average performance</div>
      </div>
    `;

    // Display quiz history
    if (!history.length) {
      historyContainer.innerHTML = `
        <div class="history-empty">
          <div class="empty-icon"></div>
          <div class="empty-text">No games played yet. Take your first quiz!</div>
          <button class="btn-primary center-button" onclick="location.href='/quiz'">Start Your First Quiz</button>
        </div>
      `;
      return;
    }

    historyContainer.innerHTML = history.map((game, idx) => {
      const percent = ((game.score / game.total) * 100).toFixed(1);
      const performanceClass = getPerformanceClass(parseFloat(percent));

      return `
        <div class="history-item">
          <div class="history-rank">#${idx + 1}</div>
          <div class="history-details">
            <div class="history-score">${game.score} / ${game.total}</div>
            <div class="history-date">${new Date(game.createdAt).toLocaleString()}</div>
          </div>
          <div class="history-progress-bar">
            <div class="history-progress-fill" style="width: ${percent}%"></div>
          </div>
          <div class="history-percent ${performanceClass}">${percent}%</div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    infoEl.innerHTML = '<div class="profile-username">Error loading profile</div>';
    historyContainer.innerHTML = `
      <div class="history-empty">
        <div class="empty-icon"></div>
        <div class="empty-text">Error loading history.</div>
      </div>
    `;
  }
}

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (err) {
    alert('Error logging out');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('profileInfo')) {
    loadProfile();
  }
});
