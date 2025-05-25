const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./military_assets.db');

// Insert into assets
db.run(`INSERT INTO assets (name, type) VALUES ('Rifle', 'Weapon')`);
db.run(`INSERT INTO assets (name, type) VALUES ('Tank', 'Vehicle')`);
db.run(`INSERT INTO assets (name, type) VALUES ('Radio', 'Communication')`);

// Insert into purchases
db.run(`INSERT INTO purchases (base_id, asset_id, equipment_type, quantity, date)
        VALUES (1, 1, 'Weapon', 10, '2024-01-01')`);
db.run(`INSERT INTO purchases (base_id, asset_id, equipment_type, quantity, date)
        VALUES (1, 2, 'Vehicle', 5, '2024-01-03')`);

// Insert into transfers
db.run(`INSERT INTO transfers (from_base_id, to_base_id, asset_id, quantity, date)
        VALUES (1, 2, 1, 3, '2024-01-05')`);

// Insert into assignments
db.run(`INSERT INTO assignments (base_id, asset_id, assigned_to, quantity, date)
        VALUES (1, 2, 'John Doe', 2, '2024-01-10')`);

// Insert into expenditures
db.run(`INSERT INTO expenditures (base_id, asset_id, quantity, reason, date)
        VALUES (1, 3, 1, 'Damaged in training', '2024-01-12')`);

db.close(() => {
  console.log('✅ Sample data inserted successfully!');
});