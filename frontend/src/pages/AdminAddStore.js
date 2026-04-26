import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner' } })
      .then(r => setOwners(r.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post('/admin/stores', form);
      toast.success('Store created successfully!');
      navigate('/admin/stores');
    } catch (err) {
      const serverErrs = err.response?.data?.errors;
      if (serverErrs) {
        const mapped = {};
        serverErrs.forEach((e) => { mapped[e.path] = e.msg; });
        setErrors(mapped);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create store');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add New Store</h1>
      </div>
      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'Store Name (20–60 chars)', placeholder: 'Store name...' },
            { name: 'email', label: 'Store Email', type: 'email', placeholder: 'store@example.com' },
            { name: 'address', label: 'Address', placeholder: 'Store address...' },
          ].map(({ name, label, type = 'text', placeholder }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input className="form-input" type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} />
              {errors[name] && <p className="form-error">{errors[name]}</p>}
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Assign Owner (optional)</label>
            <select className="form-input" name="owner_id" value={form.owner_id} onChange={handleChange}>
              <option value="">— No Owner —</option>
              {owners.map(o => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Store'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/stores')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
