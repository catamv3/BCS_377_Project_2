// public/js/common.js

// Helper to read query parameters
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Initialize nav user state (called on each page)
async function initWayfinder() {
  const logoutBtn = document.getElementById('wayfinderLogout');

  // Set up logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault(); // Prevent default link behavior
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
      } catch (err) {
        console.error('Logout error:', err);
        // Still redirect even if logout fails
        window.location.href = '/';
      }
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
    const href = link.getAttribute('href');
    // Skip logout link and other special links
    if (href === '#' || link.id === 'wayfinderLogout') return;

    const target = normalize(href);
    if (target === currentPath) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWayfinder();
  markActiveWayfinderLink();
});
