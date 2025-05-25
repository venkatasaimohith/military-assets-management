// server/routes/assignments.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const allowRoles = require('../middleware/rbac');
const logApiAction = require('../utils/logger');

// =================== GET all assignments ====================
router.get('/', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM assignments`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Assignment fetch error:', err.message);
      logApiAction({
        user_id: req.user.id,
        role: req.user.role,
        endpoint: req.originalUrl,
        method: req.method,
        status_code: 500,
        message: '❌ Failed to fetch assignments'
      });
      return res.status(500).json({ error: err.message });
    }

    logApiAction({
      user_id: req.user.id,
      role: req.user.role,
      endpoint: req.originalUrl,
      method: req.method,
      status_code: 200,
      message: '✅ Assignments fetched successfully'
    });

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

      logApiAction({
        user_id: req.user.id,
        role: req.user.role,
        endpoint: req.originalUrl,
        method: req.method,
        status_code: 500,
        message: '❌ Failed to insert assignment'
      });

      return res.status(500).json({ message: 'Database error during insert' });
    }
    console.log("Logger function called");
    logApiAction({
      user_id: req.user.id,
      role: req.user.role,
      endpoint: req.originalUrl,
      method: req.method,
      status_code: 201,
      message: '✅ Assignment added successfully'
    });

    res.status(201).json({
      message: '✅ Assignment added successfully',
      assignment_id: this.lastID
    });
  });
});

module.exports = router;