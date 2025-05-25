const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const allowRoles = require('../middleware/rbac');
const logApiAction = require('../utils/logger');
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
      console.log("Logger function called");
          logApiAction({
            user_id: req.user.id,
            role: req.user.role,
            endpoint: req.originalUrl,
            method: req.method,
            status_code: 500,
            message: '❌ Expenditure insert error'
      });
      return res.status(500).json({ message: 'Failed to insert expenditure' });
    }
    logApiAction({
            user_id: req.user.id,
            role: req.user.role,
            endpoint: req.originalUrl,
            method: req.method,
            status_code: 201,
            message: '✅ Expenditure added'
      });
    res.status(201).json({ message: '✅ Expenditure added', id: this.lastID });
  });
});

// Get all expenditures
router.get('/', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM expenditures`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log("Logger function called");
          logApiAction({
            user_id: req.user.id,
            role: req.user.role,
            endpoint: req.originalUrl,
            method: req.method,
            status_code: 201,
            message: '✅ expenditure fetched successfully'
      });
    res.json({ expenditures: rows });
    
  });
});

module.exports = router;