import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stores/owner/dashboard')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-state" style={{ paddingTop: 80 }}>
      <div className="spinner" />
      <span>Loading dashboard...</span>
    </div>
  );
  if (!data) return null;

  if (!data.store) return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Store Dashboard</h1>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>◈</div>
        <h3 style={{ marginBottom: 8 }}>No store assigned</h3>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Contact an administrator to assign a store to your account.</p>
      </div>
    </div>
  );

  const avgRating = parseFloat(data.avg_rating) || 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{data.store.name}</h1>
          <p className="page-subtitle">Store performance overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <span className="stat-icon" style={{ color: 'var(--yellow)' }}>★</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div className="stat-value" style={{ color: 'var(--yellow)' }}>
              {avgRating || '—'}
            </div>
            {avgRating > 0 && (
              <span style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>/ 5</span>
            )}
          </div>
          <div className="stat-label">Average Rating</div>
          {avgRating > 0 && (
            <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{
                  color: i <= Math.round(avgRating) ? 'var(--yellow)' : 'var(--border)',
                  fontSize: 16
                }}>★</span>
              ))}
            </div>
          )}
        </div>

        <div className="stat-card">
          <span className="stat-icon" style={{ color: 'var(--accent)' }}>◎</span>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>
            {data.total_ratings || 0}
          </div>
          <div className="stat-label">Total Reviews</div>
        </div>
      </div>

      {/* Raters table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Customer Reviews</h3>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
              {data.raters?.length || 0} customers have rated your store
            </p>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {!data.raters || data.raters.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <span className="empty-state-icon">★</span>
                      <strong>No reviews yet</strong>
                      <span>Customers who rate your store will appear here</span>
                    </div>
                  </td>
                </tr>
              ) : data.raters.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: 'var(--bg4)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, flexShrink: 0, color: 'var(--text2)',
                      }}>
                        {r.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text2)', fontSize: 13 }}>{r.email}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <span key={i} style={{
                            color: i <= r.rating ? 'var(--yellow)' : 'var(--border)',
                            fontSize: 13
                          }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>
                        {r.rating}/5
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text2)', fontSize: 13 }}>
                    {new Date(r.rated_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
