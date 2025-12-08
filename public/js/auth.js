// public/js/auth.js

async function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value
  };

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok) {
      window.location.href = '/login';
    } else {
      console.error('Signup failed:', data.message);
    }
  } catch (err) {
    console.error('Network error during signup:', err);
  } finally {
    btn.disabled = false;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    usernameOrEmail: form.usernameOrEmail.value.trim(),
    password: form.password.value
  };

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok) {
      window.location.href = '/profile';
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (err) {
    console.error('Network error during login:', err);
  } finally {
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) signupForm.addEventListener('submit', handleSignup);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
});
