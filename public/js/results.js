// public/js/results.js

document.addEventListener('DOMContentLoaded', () => {
  const scoreEl = document.getElementById('resultsScore');
  const detailEl = document.getElementById('resultsDetail');

  const score = Number(getQueryParam('score'));
  const total = Number(getQueryParam('total'));

  if (!score && score !== 0 && !total) {
    scoreEl.textContent = 'No recent score found.';
    detailEl.textContent = 'Play a quiz to see your results here.';
    return;
  }

  scoreEl.textContent = `${score} / ${total}`;

  let message = '';
  const pct = (score / total) * 100;
  if (pct === 100) {
    message = 'Perfect score! You are a trivia machine!';
  } else if (pct >= 80) {
    message = 'Nice work! You really know your stuff.';
  } else if (pct >= 50) {
    message = 'Not bad at all – review and try again.';
  } else {
    message = 'Everyone starts somewhere. Run it back!';
  }
  detailEl.textContent = message;
});
