import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(r => setUser(r.data))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'User not found');
        navigate('/admin/users');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="loading-state" style={{ paddingTop: 80 }}>
      <div className="spinner" />
      <span>Loading user details...</span>
    </div>
  );

  if (!user) return null;

  const roleBadge = (role) => (
    <span className={`badge badge-${role === 'store_owner' ? 'owner' : role}`} style={{ fontSize: 13 }}>
      {role === 'store_owner' ? 'Store Owner' : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );

  const roleLabel = { admin: 'Administrator', user: 'Normal User', store_owner: 'Store Owner' };

  const initials = user.name?.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const details = [
    { label: 'Full Name', value: user.name },
    { label: 'Email Address', value: user.email },
    { label: 'Address', value: user.address || 'Not provided' },
    { label: 'Role', value: roleLabel[user.role] || user.role },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Details</h1>
          <p className="page-subtitle">Viewing profile information</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/users')}>
          ← Back to Users
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 560 }}>
        {/* Profile card */}
        <div className="card">
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            paddingBottom: 20, marginBottom: 20,
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 14,
              background: 'linear-gradient(135deg, #4f7cff, #7c5cff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, flexShrink: 0, color: '#fff',
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{user.name}</h2>
              {roleBadge(user.role)}
            </div>
          </div>

          {/* Details */}
          {details.map(({ label, value }) => (
            <div key={label} style={{
              marginBottom: 16, paddingBottom: 16,
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                fontSize: 10, color: 'var(--text2)', marginBottom: 5,
                textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
              }}>
                {label}
              </div>
              <div style={{ fontSize: 14.5, color: 'var(--text)', fontWeight: 500 }}>{value}</div>
            </div>
          ))}

          {/* Store owner info */}
          {user.role === 'store_owner' && (
            <>
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{
                  fontSize: 10, color: 'var(--text2)', marginBottom: 5,
                  textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
                }}>Store Name</div>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>
                  {user.store_name || <span style={{ color: 'var(--text3)' }}>No store assigned</span>}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 10, color: 'var(--text2)', marginBottom: 10,
                  textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
                }}>Store Rating</div>
                {user.avg_rating ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} style={{
                          color: i <= Math.round(user.avg_rating) ? 'var(--yellow)' : 'var(--border)',
                          fontSize: 22
                        }}>★</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>
                      {user.avg_rating}
                    </span>
                    <span style={{ color: 'var(--text2)', fontSize: 13 }}>/ 5</span>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text3)', fontSize: 14 }}>No ratings yet</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
