// public/js/leaderboard.js

async function loadLeaderboard() {
  const tbody = document.getElementById('leaderboardBody');
  tbody.innerHTML = '<tr><td colspan="4">Loading leaderboard...</td></tr>';

  try {
    const res = await fetch('/api/leaderboard/top');
    if (!res.ok) {
      tbody.innerHTML = '<tr><td colspan="4">Error loading leaderboard.</td></tr>';
      return;
    }

    const data = await res.json();
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="4">No scores yet.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map((row, idx) => `
      <tr>
        <td>#${idx + 1}</td>
        <td>${row.username}</td>
        <td>${row.bestScore}</td>
        <td>${row.gamesPlayed}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4">Error loading leaderboard.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('leaderboardBody')) {
    loadLeaderboard();
  }
});
