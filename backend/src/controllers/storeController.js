const pool = require('../config/db');

// GET /api/stores  (Normal User - list all stores with user's rating)
const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const allowedSort = ['name', 'address', 'avg_rating'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.email, s.address,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(r.id) AS total_ratings,
        ur.rating AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [req.user.id];

    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` GROUP BY s.id, ur.rating ORDER BY ${sortCol === 'avg_rating' ? 'avg_rating' : `s.${sortCol}`} ${sortOrder}`;
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/stores/:id/ratings
const submitRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id;

    const [store] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (store.length === 0) return res.status(404).json({ message: 'Store not found' });

    // Upsert rating
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [userId, storeId, rating]
    );

    const [[{ avg_rating }]] = await pool.query(
      'SELECT ROUND(AVG(rating), 1) AS avg_rating FROM ratings WHERE store_id = ?',
      [storeId]
    );
    res.json({ message: 'Rating submitted successfully', avg_rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStores, submitRating };
