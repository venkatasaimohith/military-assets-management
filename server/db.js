const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the SQLite DB
const db = new sqlite3.Database(path.resolve(__dirname, 'military_assets.db'), (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

// ✅ Prevent "database is locked" by adding a busy timeout
db.run('PRAGMA busy_timeout = 5000');

// ✅ Create all necessary tables
db.serialize(() => {
  // Assets Table
  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT
    )
  `);

  // Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      base_id INTEGER
    )
  `);

  // Purchases Table
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_id INTEGER,
      asset_id INTEGER,
      equipment_type TEXT,
      quantity INTEGER,
      date TEXT
    )
  `);

  // Transfers Table
  db.run(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER,
      from_base_id INTEGER,
      to_base_id INTEGER,
      quantity INTEGER,
      date TEXT
    )
  `);

  // Assignments Table
  db.run(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_id INTEGER,
      asset_id INTEGER,
      quantity INTEGER,
      date TEXT
    )
  `);

  // Expenditures Table
  db.run(`
    CREATE TABLE IF NOT EXISTS expenditures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_id INTEGER,
      asset_id INTEGER,
      quantity INTEGER,
      date TEXT,
      reason TEXT
    )
  `);
});

module.exports = db;