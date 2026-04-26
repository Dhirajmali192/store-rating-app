import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const StarDisplay = ({ rating }) => {
  if (!rating) return <span style={{ color: 'var(--text2)' }}>No ratings</span>;
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? 'var(--yellow)' : 'var(--border)', fontSize: 16 }}>★</span>
      ))}
      <span style={{ marginLeft: 6, fontSize: 13, color: 'var(--text2)' }}>{rating}</span>
    </span>
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

  const toggleSort = (col) => setSort(prev => ({
    sortBy: col,
    order: prev.sortBy === col && prev.order === 'ASC' ? 'DESC' : 'ASC',
  }));

  const SortIcon = ({ col }) => sort.sortBy === col
    ? <span> {sort.order === 'ASC' ? '↑' : '↓'}</span>
    : <span style={{ color: 'var(--border)' }}> ↕</span>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Stores</h1>
        <Link to="/admin/stores/add" className="btn btn-primary btn-sm">+ Add Store</Link>
      </div>

      <div className="filters">
        {['name', 'email', 'address'].map(f => (
          <input key={f} className="form-input" placeholder={`Filter by ${f}...`}
            value={filters[f]} onChange={e => setFilters({ ...filters, [f]: e.target.value })} />
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {[['name','Name'],['email','Email'],['address','Address'],['avg_rating','Rating']].map(([col,label]) => (
                  <th key={col} onClick={() => toggleSort(col)}>{label}<SortIcon col={col} /></th>
                ))}
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text2)', padding: 40 }}>Loading...</td></tr>
              ) : stores.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text2)', padding: 40 }}>No stores found</td></tr>
              ) : stores.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ color: 'var(--text2)' }}>{s.email}</td>
                  <td style={{ color: 'var(--text2)', maxWidth: 180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.address}</td>
                  <td><StarDisplay rating={s.avg_rating} /></td>
                  <td style={{ color: 'var(--text2)' }}>{s.owner_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
