import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, ...sort };
      const { data } = await api.get('/admin/users', { params });
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSort = (col) => {
    setSort(prev => ({
      sortBy: col,
      order: prev.sortBy === col && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const SortIcon = ({ col }) => {
    if (sort.sortBy !== col) return <span style={{ color: 'var(--border)' }}> ↕</span>;
    return <span> {sort.order === 'ASC' ? '↑' : '↓'}</span>;
  };

  const roleBadge = (role) => (
    <span className={`badge badge-${role === 'store_owner' ? 'owner' : role}`}>
      {role === 'store_owner' ? 'Store Owner' : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <Link to="/admin/users/add" className="btn btn-primary btn-sm">+ Add User</Link>
      </div>

      {/* Filters */}
      <div className="filters">
        {['name', 'email', 'address'].map(f => (
          <input
            key={f}
            className="form-input"
            placeholder={`Filter by ${f}...`}
            value={filters[f]}
            onChange={e => setFilters({ ...filters, [f]: e.target.value })}
          />
        ))}
        <select className="form-input" value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {[['name','Name'],['email','Email'],['address','Address'],['role','Role']].map(([col,label]) => (
                  <th key={col} onClick={() => toggleSort(col)}>
                    {label}<SortIcon col={col} />
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text2)', padding: 40 }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text2)', padding: 40 }}>No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: 'var(--text2)' }}>{u.email}</td>
                  <td style={{ color: 'var(--text2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address || '—'}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="btn btn-secondary btn-sm">View</Link>
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
