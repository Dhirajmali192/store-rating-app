import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

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
        <h1 className="page-title">Add New User</h1>
      </div>
      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'Full Name (20–60 chars)', type: 'text', placeholder: 'Full name...' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'user@example.com' },
            { name: 'address', label: 'Address', type: 'text', placeholder: 'Address...' },
            { name: 'password', label: 'Password (8–16 chars, 1 uppercase, 1 special)', type: 'password', placeholder: '••••••••' },
          ].map(({ name, label, type, placeholder }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input className="form-input" type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} />
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
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
