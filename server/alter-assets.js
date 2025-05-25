const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'military_assets.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`ALTER TABLE assets ADD COLUMN opening_balance INTEGER DEFAULT 100`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('⚠ Column "opening_balance" already exists.');
      } else {
        console.error('❌ Error adding column:', err.message);
      }
    } else {
      console.log('✅ Column "opening_balance" added successfully!');
    }

    db.close();
  });
});