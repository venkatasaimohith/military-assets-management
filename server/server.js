const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db'); // Connects to SQLite and logs connection

// Load environment variables
dotenv.config();

// Route files
const authRoutes = require('./routes/auth');
const purchaseRoutes = require('./routes/purchases');
const transferRoutes = require('./routes/transfers');
const assignmentRoutes = require('./routes/assignments');
const expenditureRoutes = require('./routes/expenditures');
const dashboardRoutes = require('./routes/dashboard');
const assetRoutes = require('./routes/assets');

// Middleware
const authenticateToken = require('./middleware/auth');
const allowRoles = require('./middleware/rbac');

// Init app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);               // POST /api/auth/login
app.use('/api/purchases', purchaseRoutes);      // GET, POST /api/purchases
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assets', assetRoutes);

// 🔐 Protected route test
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
  });
});

// 👑 Admin-only route test
app.get('/api/admin-only', authenticateToken, allowRoles('admin'), (req, res) => {
  res.json({
    message: 'Welcome, Admin!',
    user: req.user,
  });
});

// Root
app.get('/', (req, res) => {
  res.send('✅ Military Asset Management Backend is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});