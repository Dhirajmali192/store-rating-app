import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const fields = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter full name (20–60 chars)', hint: '20–60 characters required' },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com' },
  { name: 'address', label: 'Address', type: 'text', placeholder: 'User address (optional)', hint: 'Up to 400 characters' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Create password', hint: '8–16 chars · 1 uppercase · 1 special char' },
];

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      const serverErrs = err.response?.data?.errors;
      if (serverErrs) {
        const mapped = {};
        serverErrs.forEach((e) => { mapped[e.path] = e.msg; });
        setErrors(mapped);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New User</h1>
          <p className="page-subtitle">Create a new user account on the platform</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/users')}>
          ← Back to Users
        </button>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type, placeholder, hint }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
              />
              {hint && !errors[name] && (
                <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{hint}</p>
              )}
              {errors[name] && <p className="form-error">{errors[name]}</p>}
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" name="role" value={form.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
