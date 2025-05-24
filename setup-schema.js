const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./military_assets.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_id INTEGER NOT NULL,
      asset_id INTEGER NOT NULL,
      equipment_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating purchases table:', err.message);
    } else {
      console.log('✅ purchases table created successfully.');
    }
  });
});

db.close();