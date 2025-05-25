const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./military_assets.db');

db.serialize(() => {
  db.run(`ALTER TABLE purchases ADD COLUMN equipment_type TEXT`, (err) => {
    if (err) {
      console.error('❌ Error altering table:', err.message);
    } else {
      console.log('✅ equipment_type column added to purchases table');
    }
  });
});