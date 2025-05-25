const db = require('../db');

function logApiAction({ user_id, role, endpoint, method, status_code, message }) {
  const timestamp = new Date().toISOString();

  const sql = `
    INSERT INTO api_logs (user_id, role, endpoint, method, timestamp, status_code, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [user_id, role, endpoint, method, timestamp, status_code, message], (err) => {
    if (err) {
      console.error("❌ Failed to log API action:", err.message);
    }else{
        console.log("✅Logged to api_logs successfully");
    }
  });
}

module.exports = logApiAction;