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
      alert('Account created successfully! Please log in with your credentials.');
      window.location.href = '/login';
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    alert('Network error during signup');
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
      alert('Welcome back, ' + data.username + '!');
      window.location.href = '/profile';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Network error during login');
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
