import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? 'star-filled' : 'star-empty'}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ cursor: readonly ? 'default' : 'pointer', fontSize: 22 }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [loading, setLoading] = useState(true);
  const [pendingRating, setPendingRating] = useState({});
  const [submitting, setSubmitting] = useState({});

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stores', { params: { ...filters, ...sort } });
      setStores(data);
      // Initialize pending ratings from user's submitted ratings
      const ratings = {};
      data.forEach(s => { if (s.user_rating) ratings[s.id] = s.user_rating; });
      setPendingRating(ratings);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRate = async (storeId) => {
    const rating = pendingRating[storeId];
    if (!rating) return toast.error('Please select a rating first');
    setSubmitting(prev => ({ ...prev, [storeId]: true }));
    try {
      const { data } = await api.post(`/stores/${storeId}/ratings`, { rating });
      toast.success('Rating submitted!');
      setStores(prev => prev.map(s => s.id === storeId ? { ...s, avg_rating: data.avg_rating, user_rating: rating } : s));
    } catch { toast.error('Failed to submit rating'); }
    finally { setSubmitting(prev => ({ ...prev, [storeId]: false })); }
  };

  const toggleSort = (col) => setSort(prev => ({
    sortBy: col,
    order: prev.sortBy === col && prev.order === 'ASC' ? 'DESC' : 'ASC',
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Browse Stores</h1>
        <span style={{ color: 'var(--text2)', fontSize: 14 }}>{stores.length} stores</span>
      </div>

      {/* Search */}
      <div className="filters">
        <input className="form-input" placeholder="Search by name..." value={filters.name}
          onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input className="form-input" placeholder="Search by address..." value={filters.address}
          onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <select className="form-input" value={`${sort.sortBy}-${sort.order}`}
          onChange={e => { const [sortBy, order] = e.target.value.split('-'); setSort({ sortBy, order }); }}>
          <option value="name-ASC">Name A–Z</option>
          <option value="name-DESC">Name Z–A</option>
          <option value="avg_rating-DESC">Highest Rated</option>
          <option value="avg_rating-ASC">Lowest Rated</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text2)', padding: 60 }}>Loading stores...</div>
      ) : stores.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text2)', padding: 60 }}>No stores found</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {stores.map(store => (
            <div key={store.id} className="card">
              {/* Store header */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{store.name}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13 }}>📍 {store.address}</p>
              </div>

              {/* Overall rating */}
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg3)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>OVERALL RATING</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StarRating value={Math.round(store.avg_rating || 0)} readonly />
                  <span style={{ fontWeight: 700, fontSize: 18 }}>{store.avg_rating || '—'}</span>
                  <span style={{ color: 'var(--text2)', fontSize: 13 }}>({store.total_ratings || 0})</span>
                </div>
              </div>

              {/* User's rating */}
              <div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
                  {store.user_rating ? 'YOUR RATING (click to update)' : 'RATE THIS STORE'}
                </div>
                <StarRating
                  value={pendingRating[store.id] || 0}
                  onChange={(val) => setPendingRating(prev => ({ ...prev, [store.id]: val }))}
                />
                {store.user_rating && !pendingRating[store.id] && (
                  <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>You rated: {store.user_rating}★</p>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 12 }}
                  onClick={() => handleRate(store.id)}
                  disabled={submitting[store.id] || !pendingRating[store.id]}
                >
                  {submitting[store.id] ? 'Submitting...' : store.user_rating ? '✏️ Update Rating' : '★ Submit Rating'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
