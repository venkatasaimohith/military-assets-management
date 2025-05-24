const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
  const { base_id, role } = req.user;
  const { startDate, endDate, baseId, equipmentType } = req.query;

  const filters = [];
  const params = [];

  // Filter: Equipment Type
  if (equipmentType) {
    filters.push(`a.type LIKE ?`);
    params.push(`%${equipmentType}%`);
  }

  // Filter: Base-specific access
  const effectiveBaseId = role !== 'admin' ? base_id : baseId || null;

  const dateFilter = (tableAlias) => {
    const clauses = [];
    if (startDate) {
      clauses.push(`${tableAlias}.date >= ?`);
      params.push(startDate);
    }
    if (endDate) {
      clauses.push(`${tableAlias}.date <= ?`);
      params.push(endDate);
    }
    return clauses.length ? ` AND ${clauses.join(' AND ')}` : '';
  };

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const sql = `
    SELECT 
      a.name,
      a.id AS asset_id,
      (
        SELECT IFNULL(SUM(p.quantity), 0)
        FROM purchases p
        WHERE p.asset_id = a.id AND p.base_id = COALESCE(?, p.base_id) ${dateFilter('p')}
      ) AS purchases,
      (
        SELECT IFNULL(SUM(t.quantity), 0)
        FROM transfers t
        WHERE t.asset_id = a.id AND t.to_base_id = COALESCE(?, t.to_base_id) ${dateFilter('t')}
      ) AS transfers_in,
      (
        SELECT IFNULL(SUM(t.quantity), 0)
        FROM transfers t
        WHERE t.asset_id = a.id AND t.from_base_id = COALESCE(?, t.from_base_id) ${dateFilter('t')}
      ) AS transfers_out,
      (
        SELECT IFNULL(SUM(a2.quantity), 0)
        FROM assignments a2
        WHERE a2.asset_id = a.id AND a2.base_id = COALESCE(?, a2.base_id) ${dateFilter('a2')}
      ) AS assigned,
      (
        SELECT IFNULL(SUM(e.quantity), 0)
        FROM expenditures e
        WHERE e.asset_id = a.id AND e.base_id = COALESCE(?, e.base_id) ${dateFilter('e')}
      ) AS expended
    FROM assets a
    ${whereClause}
    GROUP BY a.id
  `;

  // Inject base_id params for COALESCE
  params.unshift(effectiveBaseId, effectiveBaseId, effectiveBaseId, effectiveBaseId, effectiveBaseId);

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('❌ Dashboard query failed:', err.message);
      return res.status(500).json({ message: 'Dashboard query failed' });
    }

    const results = rows.map(asset => {
      const opening = 100;
      const closing = opening + asset.purchases + asset.transfers_in - asset.transfers_out - asset.assigned - asset.expended;

      return {
        name: asset.name,
        opening_balance: opening,
        purchases: asset.purchases,
        transfers_in: asset.transfers_in,
        transfers_out: asset.transfers_out,
        assigned: asset.assigned,
        expended: asset.expended,
        closing_balance: closing
      };
    });

    res.json({ assets: results });
  });
});

module.exports = router;