const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'admin'"
    );
    const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
    const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
    const allowedSort = ['name', 'email', 'address', 'role', 'created_at'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role,
        ROUND(AVG(r.rating), 1) AS avg_rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (name) { query += ' AND u.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND u.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND u.address LIKE ?'; params.push(`%${address}%`); }
    if (role) { query += ' AND u.role = ?'; params.push(role); }

    query += ` GROUP BY u.id ORDER BY u.${sortCol} ${sortOrder}`;
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role,
        s.id AS store_id, s.name AS store_name,
        ROUND(AVG(r.rating), 1) AS avg_rating
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE u.id = ?
       GROUP BY u.id, u.name, u.email, u.address, u.role, s.id, s.name`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const validRoles = ['admin', 'user', 'store_owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address || '', role]
    );
    res.status(201).json({ id: result.insertId, name, email, address, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/stores
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
    const allowedSort = ['name', 'email', 'address', 'avg_rating'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
        u.name AS owner_name,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(r.id) AS total_ratings
      FROM stores s
      LEFT JOIN users u ON u.id = s.owner_id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` GROUP BY s.id ORDER BY ${sortCol === 'avg_rating' ? 'avg_rating' : `s.${sortCol}`} ${sortOrder}`;
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/stores
const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const [existing] = await pool.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Store email already exists' });
    }
    if (owner_id) {
      const [owner] = await pool.query(
        "SELECT id FROM users WHERE id = ? AND role = 'store_owner'",
        [owner_id]
      );
      if (owner.length === 0) {
        return res.status(400).json({ message: 'Invalid store owner' });
      }
    }
    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );
    res.status(201).json({ id: result.insertId, name, email, address, owner_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, createStore };
