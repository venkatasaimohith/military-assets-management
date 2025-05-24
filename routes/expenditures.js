const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const allowRoles = require('../middleware/rbac');

// Add an expenditure
router.post('/', authenticateToken, allowRoles('admin', 'logistics_officer'), (req, res) => {
  const { base_id, asset_id, quantity, reason, date } = req.body;

  if (!base_id || !asset_id || !quantity || !date) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const sql = `
    INSERT INTO expenditures (base_id, asset_id, quantity, reason, date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [base_id, asset_id, quantity, reason, date], function (err) {
    if (err) {
      console.error('❌ Expenditure insert error:', err.message);
      return res.status(500).json({ message: 'Failed to insert expenditure' });
    }
    res.status(201).json({ message: '✅ Expenditure added', id: this.lastID });
  });
});

// Get all expenditures
router.get('/', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM expenditures`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ expenditures: rows });
  });
});

module.exports = router;