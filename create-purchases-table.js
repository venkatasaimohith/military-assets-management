const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'military_assets.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_id INTEGER,
      asset_id INTEGER,
      equipment_type TEXT,
      quantity INTEGER,
      date TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating purchases table:', err.message);
    } else {
      console.log('✅ Purchases table created successfully');
    }
    db.close();
  });
});