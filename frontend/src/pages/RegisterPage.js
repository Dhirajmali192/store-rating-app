import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ✅ Moved OUTSIDE the main component — this fixes the cursor losing focus bug
const Field = ({ name, label, type = 'text', placeholder, value, onChange, error }) => (
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
    if (form.name.length < 20 || form.name.length > 60)
      errs.name = 'Name must be 20–60 characters';
    if (form.address.length > 400)
      errs.address = 'Address max 400 characters';
    if (form.password.length < 8 || form.password.length > 16)
      errs.password = 'Password must be 8–16 characters';
    else if (!/[A-Z]/.test(form.password))
      errs.password = 'Password must contain an uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
      errs.password = 'Password must contain a special character';
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
      toast.success('Account created!');
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
      <div className="auth-card card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join RateStore and start rating stores</p>

        <form onSubmit={handleSubmit}>
          <Field
            name="name"
            label="Full Name (20–60 chars)"
            placeholder="Your full name here..."
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="address"
            label="Address (optional)"
            placeholder="Your address..."
            value={form.address}
            onChange={handleChange}
            error={errors.address}
          />
          <Field
            name="password"
            label="Password (8–16 chars, 1 uppercase, 1 special)"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: 14 }}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}