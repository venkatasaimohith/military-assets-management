const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // Make sure you have both id and role
    req.user = {
      id: user.id,       // <-- must be in token payload
      role: user.role    // <-- must be in token payload
    };

    next();
  });
}

module.exports = authenticateToken;