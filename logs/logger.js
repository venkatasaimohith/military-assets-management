// middleware/logger.js
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/api.log');

const logger = (req, res, next) => {
  const user = req.user ? `${req.user.username} (${req.user.role})` : 'Unauthenticated';
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} by ${user}\n`;

  // Ensure log directory exists
  fs.mkdirSync(path.dirname(logFile), { recursive: true });

  // Append to log file
  fs.appendFile(logFile, log, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });

  next();
};

module.exports = logger;