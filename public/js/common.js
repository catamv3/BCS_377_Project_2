// public/js/common.js

// Helper to read query parameters
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const DEVICE_CLASS_PREFIX = 'device-';
const DEVICE_TYPES = ['phone', 'tablet', 'desktop'];
let activeDeviceType = null;

function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  const isIPad = /ipad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isIPhone = /iphone|ipod/.test(ua) && !isIPad;
  const isAndroid = /android/.test(ua);
  const isAndroidTablet = isAndroid && !/mobile/.test(ua);
  const viewport = Math.min(window.innerWidth, window.innerHeight);

  if (isIPad || isAndroidTablet || (viewport >= 600 && viewport <= 1024 && navigator.maxTouchPoints > 1)) {
    return 'tablet';
  }

  if (isIPhone || (isAndroid && !isAndroidTablet) || viewport < 600) {
    return 'phone';
  }

  if (viewport <= 1024) {
    return 'tablet';
  }

  return 'desktop';
}

function applyDeviceTypeClass() {
  if (!document.body) return;
  const type = detectDeviceType();
  if (type === activeDeviceType) return;

  DEVICE_TYPES.forEach(t => document.body.classList.remove(`${DEVICE_CLASS_PREFIX}${t}`));
  document.body.classList.add(`${DEVICE_CLASS_PREFIX}${type}`);
  document.body.dataset.deviceType = type;
  activeDeviceType = type;
}

function initDeviceWatcher() {
  applyDeviceTypeClass();
  let resizeTimeout;
  const scheduleUpdate = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(applyDeviceTypeClass, 120);
  };

  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('orientationchange', scheduleUpdate);
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
  initDeviceWatcher();
  initWayfinder();
  markActiveWayfinderLink();
});
