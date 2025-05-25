const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const allowRoles = require('../middleware/rbac');
const logApiAction = require('../utils/logger');

// ========================= POST /api/assignments ============================
router.post('/add', authenticateToken, allowRoles('admin', 'logistics_officer'), (req, res) => {
  const { base_id, asset_id,equipment_type, quantity, date } = req.body;

  // Validation
  if (!base_id || !asset_id || !equipment_type || !quantity || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate assignment
  const checkDuplicate = `
    SELECT * FROM purchases
    WHERE base_id = ? AND asset_id = ? AND equipment_type = ?  AND quantity = ? AND date = ?
  `;

  db.get(checkDuplicate, [base_id, asset_id, equipment_type,  quantity, date], (err, existing) => {
    if (err) {
      console.error("❌ Duplicate check error:", err.message);
      return res.status(500).json({ message: 'Error checking for duplicate' });
    }

    if (existing) {
      return res.status(409).json({ message: 'Duplicate assignment entry exists' });
    }

    // Insert new assignment
    const insertSql = `
      INSERT INTO purchases (base_id, asset_id, equipment_type, quantity, date)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(insertSql, [base_id, asset_id, equipment_type, quantity, date], function (err) {
      if (err) {
        console.error("❌ Database insert error:", err.message);
        console.log("Logger function called");
    logApiAction({
      user_id: req.user.id,
      role: req.user.role,
      endpoint: req.originalUrl,
      method: req.method,
      status_code: 500,
      message: '❌ Database insert error'
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
            message: '✅ purchases added successfully'
      });
      
      res.status(201).json({
        message: '✅ purchases recorded successfully',
        purchase_id: this.lastID
      });
    });
  });
});

// ========================= GET /api/assignments ============================
router.get('/', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM purchases order by date desc`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Fetch error:", err.message);
      
      
      return res.status(500).json({ error: err.message });
    }
    console.log("Logger function called");
          logApiAction({
            user_id: req.user.id,
            role: req.user.role,
            endpoint: req.originalUrl,
            method: req.method,
            status_code: 201,
            message: '✅ purchaces fetched successfully'
      });
    res.json({ purchases: rows });
  });
});

module.exports = router;