import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Required';
    if (form.newPassword.length < 8 || form.newPassword.length > 16) errs.newPassword = 'Password must be 8–16 characters';
    if (!/[A-Z]/.test(form.newPassword)) errs.newPassword = 'Must contain an uppercase letter';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)) errs.newPassword = 'Must contain a special character';
    if (form.newPassword !== form.confirm) errs.confirm = 'Passwords do not match';
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
        <h1 className="page-title">Change Password</h1>
      </div>
      <div className="card" style={{ maxWidth: 440 }}>
        <form onSubmit={handleSubmit}>
          {[
            { name: 'currentPassword', label: 'Current Password' },
            { name: 'newPassword', label: 'New Password (8–16 chars, 1 uppercase, 1 special)' },
            { name: 'confirm', label: 'Confirm New Password' },
          ].map(({ name, label }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                type="password"
                value={form[name]}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                placeholder="••••••••"
              />
              {errors[name] && <p className="form-error">{errors[name]}</p>}
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : '🔑 Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
