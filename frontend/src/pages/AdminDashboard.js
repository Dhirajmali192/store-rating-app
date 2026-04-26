import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => toast.error('Failed to load stats'));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/users/add" className="btn btn-primary btn-sm">+ Add User</Link>
          <Link to="/admin/stores/add" className="btn btn-secondary btn-sm">+ Add Store</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalUsers : '—'}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalStores : '—'}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalRatings : '—'}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Link to="/admin/users" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'border 0.2s', ':hover': { borderColor: 'var(--accent)' } }}>
            <h3 style={{ marginBottom: 8 }}>👥 Manage Users</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>View and manage all users on the platform</p>
          </div>
        </Link>
        <Link to="/admin/stores" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer' }}>
            <h3 style={{ marginBottom: 8 }}>🏪 Manage Stores</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>View stores and their ratings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
