const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const allowRoles = require('../middleware/rbac');

// ========================= POST /api/transfers ============================
router.post('/', authenticateToken, allowRoles('admin', 'logistics_officer'), (req, res) => {
  console.log("Received:",req.body);
  const { asset_id,from_base_id,to_base_id,quantity,date } = req.body;

  if (
  asset_id === undefined || asset_id === '' ||
  from_base_id === undefined || from_base_id === '' ||
  to_base_id === undefined || to_base_id === '' ||
  quantity === undefined || quantity === '' ||
  date === undefined || date === ''
) {
  return res.status(400).json({ message: "All fields are required" });
}

  // Step 1: Check for duplicate
  const duplicateCheck = `
    SELECT * FROM transfers 
    WHERE asset_id = ? AND from_base_id = ? AND to_base_id = ? AND quantity = ? AND date = ?
  `;
  
  db.get(duplicateCheck, [asset_id, from_base_id, to_base_id, quantity, date], (err, existing) => {
    if (err) {
      console.error('❌ Error checking for duplicate transfer:', err.message);
      return res.status(500).json({ message: 'Database error during duplicate check' });
    }

    if (existing) {
      return res.status(400).json({ message: 'Duplicate transfer exists' });
    }

    // Step 2: Proceed with insertion
    const sql = `
      INSERT INTO transfers (asset_id, from_base_id, to_base_id, quantity, date)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [from_base_id, to_base_id, asset_id, quantity, date], function (err) {
      if (err) {
        console.error('❌ Transfer error:', err.message);
        return res.status(500).json({ message: 'Database error while saving transfer' });
      }

      res.status(201).json({
        message: '✅ Transfer recorded successfully',
        transfer_id: this.lastID
      });
    });
  });
});

// ========================= GET /api/transfers ============================
router.get('/', authenticateToken, (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const sql = `SELECT * FROM transfers ORDER BY date DESC `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Transfer Fetch error:', err.message);
      return res.status(500).json({ message: 'Failed to fetch transfers' });
    }
    res.json({ transfers: rows });
  });
});

module.exports = router;