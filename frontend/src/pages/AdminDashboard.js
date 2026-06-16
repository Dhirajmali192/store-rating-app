import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => toast.error('Failed to load stats'));
  }, []);

  const statCards = [
    { icon: '◎', label: 'Total Users', value: stats?.totalUsers, color: '#8aabff' },
    { icon: '◈', label: 'Total Stores', value: stats?.totalStores, color: '#22d67a' },
    { icon: '★', label: 'Total Ratings', value: stats?.totalRatings, color: '#ffc846' },
  ];

  const quickActions = [
    {
      to: '/admin/users',
      icon: '◎',
      title: 'Manage Users',
      desc: 'View, filter, and inspect all platform users',
    },
    {
      to: '/admin/stores',
      icon: '◈',
      title: 'Manage Stores',
      desc: 'Browse stores and monitor ratings',
    },
    {
      to: '/admin/users/add',
      icon: '+',
      title: 'Add User',
      desc: 'Create a new user account',
    },
    {
      to: '/admin/stores/add',
      icon: '⊕',
      title: 'Add Store',
      desc: 'Register a new store on the platform',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Platform overview and quick actions</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/users/add" className="btn btn-primary btn-sm">+ Add User</Link>
          <Link to="/admin/stores/add" className="btn btn-secondary btn-sm">+ Add Store</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statCards.map(({ icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <span className="stat-icon" style={{ color }}>{icon}</span>
            <div className="stat-value" style={{ color }}>
              {value !== undefined ? value.toLocaleString() : (
                <span style={{ fontSize: 28 }}>—</span>
              )}
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
          Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {quickActions.map(({ to, icon, title, desc }) => (
            <Link key={to} to={to} className="action-card">
              <span className="action-card-icon" style={{ color: 'var(--accent)' }}>{icon}</span>
              <div className="action-card-title">{title}</div>
              <div className="action-card-desc">{desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
