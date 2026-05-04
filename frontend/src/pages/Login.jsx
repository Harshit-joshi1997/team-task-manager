import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './Auth.css';

const MOCK_USERS_KEY = 'registered_users';

function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function validate(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6)
    errors.password = 'Password must be at least 6 characters';
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    // Simulate API call — check against registered users in localStorage
    await new Promise((r) => setTimeout(r, 600));

    const users = getRegisteredUsers();
    const found = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (!found) {
      setServerError('Invalid email or password.');
      setLoading(false);
      return;
    }

    const fakeToken = btoa(`${found.email}:${Date.now()}`);
    login({ name: found.fullName, email: found.email, role: found.role }, fakeToken);
    navigate('/');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#grad)" />
              <path d="M8 16l5 5 11-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6c63ff" />
                  <stop offset="1" stopColor="#00e5cc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-brand-name">TaskFlow</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className={`form-input${errors.email ? ' form-input--error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className={`form-input${errors.password ? ' form-input--error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            id="login-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
