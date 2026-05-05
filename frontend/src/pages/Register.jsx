import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = 'Full name is required';
  else if (form.fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address';

  if (!form.role) errors.role = 'Please select a role';

  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
    errors.phone = 'Enter a valid phone number';

  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';

  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  return errors;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', role: '', phone: '', password: '', confirmPassword: '',
  });
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
    try {
      await api.post('/register', {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
      });

      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const msg = err.response?.data?.details || err.response?.data?.error || 'Registration failed.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#grad2)" />
              <path d="M8 16l5 5 11-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6c63ff" /><stop offset="1" stopColor="#00e5cc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-brand-name">TaskFlow</span>
        </div>

        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join your team on TaskFlow</p>

        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Row 1: Full Name + Email */}
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-fullname">Full Name</label>
              <input
                id="reg-fullname"
                type="text"
                className={`form-input${errors.fullName ? ' form-input--error' : ''}`}
                placeholder="Harshit Joshi"
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                autoComplete="name"
              />
              {errors.fullName && <p className="form-error">{errors.fullName}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className={`form-input${errors.email ? ' form-input--error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: Role + Phone */}
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">Role</label>
              <select
                id="reg-role"
                className={`form-input${errors.role ? ' form-input--error' : ''}`}
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
              >
                <option value="">— Select role —</option>
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
              {errors.role && <p className="form-error">{errors.role}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                type="tel"
                className={`form-input${errors.phone ? ' form-input--error' : ''}`}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                autoComplete="tel"
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 3: Password + Confirm */}
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className={`form-input${errors.password ? ' form-input--error' : ''}`}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                autoComplete="new-password"
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                className={`form-input${errors.confirmPassword ? ' form-input--error' : ''}`}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button id="register-submit" type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
