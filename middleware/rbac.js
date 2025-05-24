// server/middleware/rbac.js

function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
  };
}

module.exports = allowRoles; // ✅ This is the key fix