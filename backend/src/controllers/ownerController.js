const pool = require('../config/db');

// GET /api/owner/dashboard
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await pool.query('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);
    if (stores.length === 0) {
      return res.json({ store: null, avg_rating: null, raters: [] });
    }

    const storeId = stores[0].id;

    const [[{ avg_rating, total_ratings }]] = await pool.query(
      `SELECT ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS total_ratings
       FROM ratings WHERE store_id = ?`,
      [storeId]
    );

    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.updated_at AS rated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [storeId]
    );

    res.json({
      store: stores[0],
      avg_rating,
      total_ratings,
      raters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getOwnerDashboard };
