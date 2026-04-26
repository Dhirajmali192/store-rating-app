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
    <div style={{ color: 'var(--text2)', padding: 40, textAlign: 'center' }}>
      Loading user details...
    </div>
  );

  if (!user) return null;

  const roleBadge = (role) => (
    <span className={`badge badge-${role === 'store_owner' ? 'owner' : role}`}>
      {role === 'store_owner' ? 'Store Owner' : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );

  const roleLabel = {
    admin: 'Administrator',
    user: 'Normal User',
    store_owner: 'Store Owner',
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Details</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/users')}>
          ← Back to Users
        </button>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>

        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, flexShrink: 0
          }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{user.name}</h2>
            {roleBadge(user.role)}
          </div>
        </div>

        {/* Details */}
        {[
          { label: 'Full Name', value: user.name },
          { label: 'Email Address', value: user.email },
          { label: 'Address', value: user.address || 'Not provided' },
          { label: 'Role', value: roleLabel[user.role] || user.role },
        ].map(({ label, value }) => (
          <div key={label} style={{
            marginBottom: 16,
            paddingBottom: 16,
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{
              fontSize: 11,
              color: 'var(--text2)',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600
            }}>
              {label}
            </div>
            <div style={{ fontSize: 15 }}>{value}</div>
          </div>
        ))}

        {/* Store Rating — only show for Store Owner */}
        {user.role === 'store_owner' && (
          <>
            <div style={{
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{
                fontSize: 11, color: 'var(--text2)', marginBottom: 8,
                textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600
              }}>
                Store Name
              </div>
              <div style={{ fontSize: 15 }}>
                {user.store_name || 'No store assigned'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 11, color: 'var(--text2)', marginBottom: 8,
                textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600
              }}>
                Store Average Rating
              </div>
              {user.avg_rating ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div>
                    {[1, 2, 3, 4, 5].map(i => (
                      <span key={i} style={{
                        color: i <= Math.round(user.avg_rating) ? 'var(--yellow)' : 'var(--border)',
                        fontSize: 24
                      }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Syne' }}>
                    {user.avg_rating}
                  </span>
                  <span style={{ color: 'var(--text2)', fontSize: 13 }}>out of 5</span>
                </div>
              ) : (
                <div style={{ color: 'var(--text2)', fontSize: 14 }}>
                  No ratings yet for this store
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}