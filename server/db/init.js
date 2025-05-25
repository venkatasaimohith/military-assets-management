const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./military_assets.db');

// Wrap in serialize to execute sequentially
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT
    )
  `);

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

  db.run(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_id INTEGER,
      asset_id INTEGER,
      quantity INTEGER,
      date TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expenditures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_id INTEGER,
      asset_id INTEGER,
      quantity INTEGER,
      date TEXT
    )
  `);
});

db.close();