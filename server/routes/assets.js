const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Get Full Asset Summary
router.get('/', authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      a.name,
      a.opening_balance,
      COALESCE(SUM(p.quantity), 0) AS purchases,
      COALESCE(SUM(ti.quantity), 0) AS transfers_in,
      COALESCE(SUM(too.quantity), 0) AS transfers_out,
      COALESCE(SUM(ass.quantity), 0) AS assigned,
      COALESCE(SUM(e.quantity), 0) AS expended,
      (a.opening_balance + COALESCE(SUM(p.quantity), 0) + COALESCE(SUM(ti.quantity), 0) 
      - COALESCE(SUM(too.quantity), 0) - COALESCE(SUM(ass.quantity), 0) - COALESCE(SUM(e.quantity), 0)) 
      AS closing_balance
    FROM assets a
    LEFT JOIN purchases p ON p.asset_id = a.id
    LEFT JOIN transfers ti ON ti.asset_id = a.id
    LEFT JOIN transfers too ON too.asset_id = a.id
    LEFT JOIN assignments ass ON ass.asset_id = a.id
    LEFT JOIN expenditures e ON e.asset_id = a.id
    GROUP BY a.id;
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching asset data:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ assets: rows });
  });
});

module.exports = router;