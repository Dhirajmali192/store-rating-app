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
          style={{ cursor: readonly ? 'default' : 'pointer', fontSize: 20 }}
        >★</span>
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
      setStores(prev => prev.map(s =>
        s.id === storeId ? { ...s, avg_rating: data.avg_rating, user_rating: rating } : s
      ));
    } catch { toast.error('Failed to submit rating'); }
    finally { setSubmitting(prev => ({ ...prev, [storeId]: false })); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Stores</h1>
          <p className="page-subtitle">{!loading ? `${stores.length} stores available` : 'Loading...'}</p>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="filters">
        <input
          className="form-input"
          placeholder="Search by name..."
          value={filters.name}
          onChange={e => setFilters({ ...filters, name: e.target.value })}
          style={{ backgroundImage: 'none' }}
        />
        <input
          className="form-input"
          placeholder="Search by address..."
          value={filters.address}
          onChange={e => setFilters({ ...filters, address: e.target.value })}
        />
        <select
          className="form-input"
          style={{ flex: '0 0 auto', width: 'auto' }}
          value={`${sort.sortBy}-${sort.order}`}
          onChange={e => {
            const [sortBy, order] = e.target.value.split('-');
            setSort({ sortBy, order });
          }}
        >
          <option value="name-ASC">Name A–Z</option>
          <option value="name-DESC">Name Z–A</option>
          <option value="avg_rating-DESC">Highest Rated</option>
          <option value="avg_rating-ASC">Lowest Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading stores...</span></div>
      ) : stores.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">◈</span>
          <strong>No stores found</strong>
          <span>Try a different search term</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {stores.map(store => (
            <div key={store.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Store header strip */}
              <div style={{
                padding: '16px 18px 14px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg3)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>
                      {store.name}
                    </h3>
                    <p style={{ color: 'var(--text2)', fontSize: 12.5 }}>📍 {store.address}</p>
                  </div>
                  {store.user_rating && (
                    <div style={{
                      background: 'rgba(79,124,255,0.12)', color: 'var(--accent)',
                      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      Rated
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                {/* Overall rating */}
                <div style={{
                  marginBottom: 16, padding: '10px 12px',
                  background: 'var(--bg3)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>
                      Overall Rating
                    </div>
                    <StarRating value={Math.round(store.avg_rating || 0)} readonly />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Plus Jakarta Sans', color: 'var(--yellow)', lineHeight: 1 }}>
                      {store.avg_rating || '—'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                      {store.total_ratings || 0} ratings
                    </div>
                  </div>
                </div>

                {/* Rate section */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {store.user_rating ? 'Update Your Rating' : 'Rate This Store'}
                  </div>
                  <StarRating
                    value={pendingRating[store.id] || 0}
                    onChange={(val) => setPendingRating(prev => ({ ...prev, [store.id]: val }))}
                  />
                  {store.user_rating && (
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>
                      Your current rating: {store.user_rating} ★
                    </div>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                    onClick={() => handleRate(store.id)}
                    disabled={submitting[store.id] || !pendingRating[store.id]}
                  >
                    {submitting[store.id]
                      ? 'Submitting...'
                      : store.user_rating
                        ? '✏️ Update Rating'
                        : '★ Submit Rating'
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
