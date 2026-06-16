import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (form.newPassword.length < 8 || form.newPassword.length > 16)
      errs.newPassword = 'Password must be 8–16 characters';
    else if (!/[A-Z]/.test(form.newPassword))
      errs.newPassword = 'Must contain at least one uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword))
      errs.newPassword = 'Must contain at least one special character';
    if (form.newPassword !== form.confirm)
      errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully!');
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Change Password</h1>
          <p className="page-subtitle">Update your account security credentials</p>
        </div>
      </div>

      <div style={{ maxWidth: 440 }}>
        {success && (
          <div style={{
            background: 'rgba(34,214,122,0.08)',
            border: '1px solid rgba(34,214,122,0.25)',
            borderRadius: 10, padding: '14px 16px',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 18, color: 'var(--green)' }}>✓</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--green)' }}>Password updated</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Your password has been changed successfully.</div>
            </div>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {[
              { name: 'currentPassword', label: 'Current Password', hint: null },
              { name: 'newPassword', label: 'New Password', hint: '8–16 chars · 1 uppercase · 1 special character' },
              { name: 'confirm', label: 'Confirm New Password', hint: null },
            ].map(({ name, label, hint }) => (
              <div className="form-group" key={name}>
                <label className="form-label">{label}</label>
                <input
                  className="form-input"
                  type="password"
                  value={form[name]}
                  onChange={e => setForm({ ...form, [name]: e.target.value })}
                  placeholder="••••••••"
                  autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                />
                {hint && !errors[name] && (
                  <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{hint}</p>
                )}
                {errors[name] && <p className="form-error">{errors[name]}</p>}
              </div>
            ))}

            {/* Password match indicator */}
            {form.newPassword && form.confirm && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, marginBottom: 16,
                color: form.newPassword === form.confirm ? 'var(--green)' : 'var(--red)',
              }}>
                <span>{form.newPassword === form.confirm ? '✓' : '✗'}</span>
                {form.newPassword === form.confirm ? 'Passwords match' : 'Passwords do not match'}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div style={{
          marginTop: 16, padding: '14px 16px',
          background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Password Requirements
          </div>
          {[
            '8 to 16 characters long',
            'At least one uppercase letter',
            'At least one special character (e.g. !@#$%)',
          ].map(req => (
            <div key={req} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text2)', marginBottom: 5 }}>
              <span style={{ color: 'var(--accent)', fontSize: 10 }}>◆</span>
              {req}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
