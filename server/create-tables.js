const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'military_assets.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Assets Table
  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT
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
      from_base_id INTEGER,
      to_base_id INTEGER,
      asset_id INTEGER,
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
      assigned_to TEXT,
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
      reason TEXT,
      date TEXT
    )
  `);

  console.log('✅ All tables created successfully!');
  db.close();
});