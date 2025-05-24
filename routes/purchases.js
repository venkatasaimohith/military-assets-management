const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const allowRoles = require('../middleware/rbac');

// ========================= POST /api/purchases ============================
router.post('/add', authenticateToken, allowRoles('admin', 'logistics_officer'), (req, res) => {
  const { base_id, asset_id, equipment_type, quantity, date } = req.body;

  if (!base_id || !asset_id || !equipment_type || !quantity || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const checkDuplicate = `
    SELECT * FROM purchases
    WHERE base_id = ? AND asset_id = ? AND equipment_type = ? AND quantity = ? AND date = ?
  `;

  db.get(checkDuplicate, [base_id, asset_id, equipment_type, quantity, date], (err, existing) => {
    if (err) {
      console.error("❌ Duplicate check error:", err.message);
      return res.status(500).json({ message: 'Error checking for duplicate' });
    }

    if (existing) {
      return res.status(409).json({ message: 'Duplicate purchase entry exists' });
    }

    const insertSql = `
      INSERT INTO purchases (base_id, asset_id, equipment_type, quantity, date)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(insertSql, [base_id, asset_id, equipment_type, quantity, date], function (err) {
      if (err) {
        console.error("❌ DB Insert Error:", err.message);
        return res.status(500).json({ message: 'Database error during insert' });
      }

      res.status(201).json({
        message: '✅ Purchase recorded successfully',
        purchase_id: this.lastID
      });
    });
  });
});

// ========================= GET /api/purchases ============================
router.get('/', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM purchases ORDER BY date DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Fetch error:', err.message);
      return res.status(500).json({ error: err.message });
    } 
    res.json({ purchases: rows });
  });
});

// ========================= GET /api/purchases/get/:baseID ============================
router.get('/get/:baseID', authenticateToken, (req, res) => {
  const baseID = req.params.baseID;

  db.all('SELECT * FROM purchases WHERE base_id = ?', [baseID], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ purchases: rows });
  });
});

module.exports = router;