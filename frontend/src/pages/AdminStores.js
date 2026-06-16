import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const StarDisplay = ({ rating }) => {
  if (!rating) return <span style={{ color: 'var(--text3)', fontSize: 13 }}>No ratings</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{
            color: i <= Math.round(rating) ? 'var(--yellow)' : 'var(--border)',
            fontSize: 13
          }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>{rating}</span>
    </div>
  );
};

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/stores', { params: { ...filters, ...sort } });
      setStores(data);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

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
          <h1 className="page-title">Stores</h1>
          <p className="page-subtitle">{!loading ? `${stores.length} stores registered` : 'Loading...'}</p>
        </div>
        <Link to="/admin/stores/add" className="btn btn-primary btn-sm">+ Add Store</Link>
      </div>

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
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {[['name', 'Store Name'], ['email', 'Email'], ['address', 'Address'], ['avg_rating', 'Rating']].map(([col, label]) => (
                  <th key={col} onClick={() => toggleSort(col)}>
                    {label}<SortIcon col={col} />
                  </th>
                ))}
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="loading-state"><div className="spinner" /><span>Loading stores...</span></div>
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <span className="empty-state-icon">◈</span>
                      <strong>No stores found</strong>
                      <span>Try adjusting your filters</span>
                    </div>
                  </td>
                </tr>
              ) : stores.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: 'rgba(34,214,122,0.1)',
                        border: '1px solid rgba(34,214,122,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, flexShrink: 0, color: 'var(--green)',
                      }}>◈</div>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text2)' }}>{s.email}</td>
                  <td style={{
                    color: 'var(--text2)', maxWidth: 180,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{s.address}</td>
                  <td><StarDisplay rating={s.avg_rating} /></td>
                  <td style={{ color: 'var(--text2)' }}>
                    {s.owner_name || <span style={{ color: 'var(--text3)' }}>Unassigned</span>}
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
