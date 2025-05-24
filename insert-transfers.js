const db = require('./db');

db.serialize(() => {
  db.run(`
    INSERT INTO transfers (asset_id, from_base_id, to_base_id, quantity, date)
    VALUES (1, 1, 2, 20, '2025-05-22')
  `);

  db.run(`
    INSERT INTO transfers (asset_id, from_base_id, to_base_id, quantity, date)
    VALUES (2, 1, 3, 10, '2025-05-22')
  `);

  console.log('✅ Sample transfers inserted!');
});

db.close();