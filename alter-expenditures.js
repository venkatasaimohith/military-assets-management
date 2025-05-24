const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'military_assets.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`ALTER TABLE expenditures ADD COLUMN reason TEXT`, (err) => {
    if (err) {
      console.error('❌ Error altering expenditures table:', err.message);
    } else {
      console.log('✅ reason column added to expenditures table');
    }
    db.close();
  });
});