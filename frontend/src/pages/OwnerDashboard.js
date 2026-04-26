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

  if (loading) return <div style={{ color: 'var(--text2)', padding: 40 }}>Loading...</div>;
  if (!data) return null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Store Dashboard</h1>
      </div>

      {!data.store ? (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--text2)' }}>
          No store assigned to your account yet. Contact an administrator.
        </div>
      ) : (
        <>
          {/* Store Info */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>🏪 {data.store.name}</h2>
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'Syne', color: 'var(--yellow)' }}>
                  {data.avg_rating || '—'}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: 13 }}>Average Rating</div>
                <div style={{ marginTop: 8 }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: i <= Math.round(data.avg_rating) ? 'var(--yellow)' : 'var(--border)', fontSize: 22 }}>★</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'Syne', color: 'var(--accent2)' }}>
                  {data.total_ratings || 0}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: 13 }}>Total Ratings</div>
              </div>
            </div>
          </div>

          {/* Raters Table */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16 }}>Customers Who Rated</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.raters.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text2)', padding: 40 }}>No ratings yet</td></tr>
                  ) : data.raters.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500 }}>{r.name}</td>
                      <td style={{ color: 'var(--text2)' }}>{r.email}</td>
                      <td>
                        {[1,2,3,4,5].map(i => (
                          <span key={i} style={{ color: i <= r.rating ? 'var(--yellow)' : 'var(--border)', fontSize: 16 }}>★</span>
                        ))}
                        <span style={{ marginLeft: 6, color: 'var(--text2)', fontSize: 13 }}>{r.rating}/5</span>
                      </td>
                      <td style={{ color: 'var(--text2)', fontSize: 13 }}>
                        {new Date(r.rated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
