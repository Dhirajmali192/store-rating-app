import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const roleBadge = (role) => (
  <span className={`badge badge-${role === 'store_owner' ? 'owner' : role}`}>
    {role === 'store_owner' ? 'Store Owner' : role.charAt(0).toUpperCase() + role.slice(1)}
  </span>
);

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { ...filters, ...sort } });
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSort = (col) =>
    setSort(prev => ({ sortBy: col, order: prev.sortBy === col && prev.order === 'ASC' ? 'DESC' : 'ASC' }));

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sort.sortBy === col ? 1 : 0.3, fontSize: 11 }}>
      {sort.sortBy === col ? (sort.order === 'ASC' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{!loading ? `${users.length} users found` : 'Loading...'}</p>
        </div>
        <Link to="/admin/users/add" className="btn btn-primary btn-sm">+ Add User</Link>
      </div>

      {/* Filters */}
      <div className="filters">
        {[
          { key: 'name', placeholder: 'Filter by name...' },
          { key: 'email', placeholder: 'Filter by email...' },
          { key: 'address', placeholder: 'Filter by address...' },
        ].map(({ key, placeholder }) => (
          <input
            key={key}
            className="form-input"
            placeholder={placeholder}
            value={filters[key]}
            onChange={e => setFilters({ ...filters, [key]: e.target.value })}
          />
        ))}
        <select
          className="form-input"
          style={{ flex: '0 0 auto', width: 'auto' }}
          value={filters.role}
          onChange={e => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {[['name', 'Name'], ['email', 'Email'], ['address', 'Address'], ['role', 'Role']].map(([col, label]) => (
                  <th key={col} onClick={() => toggleSort(col)}>
                    {label}<SortIcon col={col} />
                  </th>
                ))}
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="loading-state"><div className="spinner" /><span>Loading users...</span></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <span className="empty-state-icon">◎</span>
                      <strong>No users found</strong>
                      <span>Try adjusting your filters</span>
                    </div>
                  </td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: 'linear-gradient(135deg, #4f7cff, #7c5cff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, flexShrink: 0, color: '#fff',
                      }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text2)' }}>{u.email}</td>
                  <td style={{
                    color: 'var(--text2)', maxWidth: 200,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {u.address || <span style={{ color: 'var(--text3)' }}>—</span>}
                  </td>
                  <td>{roleBadge(u.role)}</td>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="btn btn-secondary btn-sm">
                      View →
                    </Link>
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
