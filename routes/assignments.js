// server/routes/assignments.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const allowRoles = require('../middleware/rbac');

// =================== GET all assignments ====================
router.get('/', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM assignments`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Assignment fetch error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ assignments: rows });
  });
});

// =================== POST new assignment ====================
router.post('/', authenticateToken, allowRoles('admin', 'logistics_officer'), (req, res) => {
  const { asset_id, base_id, personnel, quantity, date } = req.body;

  if (!asset_id || !base_id || !personnel || !quantity || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const insertSql = `
    INSERT INTO assignments (asset_id, base_id, personnel, quantity, date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(insertSql, [asset_id, base_id, personnel, quantity, date], function (err) {
    if (err) {
      console.error("❌ DB Insert Error:", err.message);
      return res.status(500).json({ message: 'Database error during insert' });
    }

    res.status(201).json({
      message: '✅ Assignment added successfully',
      assignment_id: this.lastID
    });
  });
});

module.exports = router;