const bcrypt = require('bcryptjs');
const pool = require('../config/db');
require('dotenv').config();

async function seed() {
  try {
    console.log('🌱 Seeding professional demo data...');

    // ============================================================
    // ADMIN USERS
    // ============================================================
    const adminPassword = await bcrypt.hash('Admin@123', 12);

    await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['System Administrator Account', 'admin@storeapp.com', adminPassword, '42 Tech Park, Baner Road, Pune 411045', 'admin']
    );

    // ============================================================
    // STORE OWNERS
    // ============================================================
    const ownerPassword = await bcrypt.hash('Owner@123', 12);

    const [owner1] = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['Rajesh Kumar Sharma Owner', 'rajesh.sharma@freshmart.com', ownerPassword, '12 MG Road, Koregaon Park, Pune 411001', 'store_owner']
    );

    const [owner2] = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['Priya Mehta Electronics Owner', 'priya.mehta@techzone.com', ownerPassword, '88 FC Road, Shivajinagar, Pune 411005', 'store_owner']
    );

    const [owner3] = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['Anil Desai Fashion House Owner', 'anil.desai@trendsetters.com', ownerPassword, '23 JM Road, Deccan Gymkhana, Pune 411004', 'store_owner']
    );

    // ============================================================
    // STORES
    // ============================================================
    await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
      ['Fresh Mart Organic Grocery Store', 'info@freshmart.com', '12 MG Road, Koregaon Park, Pune 411001', owner1.insertId]
    );

    const [store2] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
      ['TechZone Electronics and Gadgets Hub', 'info@techzone.com', '88 FC Road, Shivajinagar, Pune 411005', owner2.insertId]
    );

    const [store3] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
      ['Trendsetters Fashion and Lifestyle Store', 'info@trendsetters.com', '23 JM Road, Deccan Gymkhana, Pune 411004', owner3.insertId]
    );

    await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
      ['BookNest Books and Stationery World', 'info@booknest.com', '56 Fergusson College Road, Pune 411004', null]
    );

    await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
      ['SpiceGarden Authentic Indian Restaurant', 'info@spicegarden.com', '34 Kalyani Nagar Main Road, Pune 411006', null]
    );

    // ============================================================
    // NORMAL USERS
    // ============================================================
    const userPassword = await bcrypt.hash('User@123', 12);

    const [user1] = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['Sneha Patil Regular Customer', 'sneha.patil@gmail.com', userPassword, '7 Viman Nagar, Pune 411014', 'user']
    );

    const [user2] = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['Rohit Verma Trusted Reviewer', 'rohit.verma@gmail.com', userPassword, '15 Kothrud Colony, Pune 411038', 'user']
    );

    const [user3] = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['Anjali Singh Verified Shopper', 'anjali.singh@gmail.com', userPassword, '9 Wakad Road, Pimpri, Pune 411057', 'user']
    );

    const [user4] = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      ['Vikram Joshi Active Community Member', 'vikram.joshi@gmail.com', userPassword, '3 Hadapsar Industrial Estate, Pune 411028', 'user']
    );

    // ============================================================
    // RATINGS (realistic data)
    // ============================================================
    const ratingsData = [
      // Fresh Mart ratings
      [user1.insertId, 1, 5],
      [user2.insertId, 1, 4],
      [user3.insertId, 1, 5],
      [user4.insertId, 1, 4],

      // TechZone ratings
      [user1.insertId, store2.insertId, 4],
      [user2.insertId, store2.insertId, 5],
      [user3.insertId, store2.insertId, 3],

      // Trendsetters ratings
      [user1.insertId, store3.insertId, 3],
      [user2.insertId, store3.insertId, 4],
      [user4.insertId, store3.insertId, 5],
    ];

    for (const [userId, storeId, rating] of ratingsData) {
      await pool.query(
        `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
        [userId, storeId, rating]
      );
    }

    console.log('');
    console.log('✅ Professional demo data seeded successfully!');
    console.log('');
    console.log('========================================');
    console.log('🔐 LOGIN CREDENTIALS');
    console.log('========================================');
    console.log('');
    console.log('👑 ADMIN:');
    console.log('   Email   : admin@storeapp.com');
    console.log('   Password: Admin@123');
    console.log('');
    console.log('🏪 STORE OWNERS:');
    console.log('   Email   : rajesh.sharma@freshmart.com');
    console.log('   Email   : priya.mehta@techzone.com');
    console.log('   Email   : anil.desai@trendsetters.com');
    console.log('   Password: Owner@123 (all owners)');
    console.log('');
    console.log('👤 NORMAL USERS:');
    console.log('   Email   : sneha.patil@gmail.com');
    console.log('   Email   : rohit.verma@gmail.com');
    console.log('   Email   : anjali.singh@gmail.com');
    console.log('   Email   : vikram.joshi@gmail.com');
    console.log('   Password: User@123 (all users)');
    console.log('========================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();