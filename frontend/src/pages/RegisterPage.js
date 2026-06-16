import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Field = ({ name, label, type = 'text', placeholder, value, onChange, error, hint }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      className="form-input"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {hint && !error && <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{hint}</p>}
    {error && <p className="form-error">{error}</p>}
  </div>
);

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
    if (form.address.length > 400) errs.address = 'Address max 400 characters';
    if (form.password.length < 8 || form.password.length > 16) errs.password = 'Password must be 8–16 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain at least one uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) errs.password = 'Must contain at least one special character';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to RateStore.');
      navigate('/stores');
    } catch (err) {
      const serverErrs = err.response?.data?.errors;
      if (serverErrs) {
        const mapped = {};
        serverErrs.forEach((e) => { mapped[e.path] = e.msg; });
        setErrors(mapped);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div className="auth-brand">
          <div className="auth-brand-icon">★</div>
          <div className="auth-brand-name">RateStore</div>
        </div>

        <div className="card">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join the platform and start rating stores</p>

          <form onSubmit={handleSubmit}>
            <Field
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              hint="Between 20 and 60 characters"
            />
            <Field
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              name="address"
              label="Address"
              placeholder="Your address (optional)"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
              hint="Up to 400 characters"
            />
            <Field
              name="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              hint="8–16 chars · 1 uppercase · 1 special character"
            />

            {/* Password strength indicator */}
            {form.password.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                  {[
                    form.password.length >= 8,
                    /[A-Z]/.test(form.password),
                    /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
                    form.password.length >= 12,
                  ].map((met, i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: met ? 'var(--green)' : 'var(--border)',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Password strength</div>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">already a member</div>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--text2)' }}>
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
