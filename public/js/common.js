// public/js/common.js

// Helper to read query parameters
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Initialize nav user state (called on each page)
async function initWayfinder() {
  const usernameEl = document.getElementById('wayfinderUsername');
  const logoutBtn = document.getElementById('wayfinderLogout');
  const initialEl = document.getElementById('navUserInitial');

  if (!usernameEl) return; // page doesn't render the nav user panel

  try {
    const res = await fetch('/api/user/me');
    if (res.ok) {
      const user = await res.json();
      usernameEl.textContent = user.username;
      if (initialEl && user.username) {
        initialEl.textContent = user.username.charAt(0).toUpperCase();
      }
      if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
      usernameEl.textContent = 'Guest';
      if (initialEl) initialEl.textContent = '';
      if (logoutBtn) logoutBtn.classList.add('hidden');
    }
  } catch (e) {
    usernameEl.textContent = 'Guest';
    if (initialEl) initialEl.textContent = '';
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    });
  }
}

function markActiveWayfinderLink() {
  const links = document.querySelectorAll('.nav-user-links a');
  if (!links.length) return;

  const normalize = (path) => {
    if (!path) return '/';
    return path === '/' ? '/' : path.replace(/\/$/, '');
  };

  const currentPath = normalize(window.location.pathname);

  links.forEach(link => {
    const target = normalize(link.getAttribute('href'));
    if (target === currentPath) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWayfinder();
  markActiveWayfinderLink();
});
