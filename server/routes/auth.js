const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router(); // VERY IMPORTANT

// ------------------- REGISTER -------------------
router.post('/register', async (req, res) => {
  const { name, email, password, role, base_id } = req.body;

  if (!name || !email || !password || !role || !base_id) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (name, email, password, role, base_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, role, base_id],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'User already exists or error creating user.' });
      }
      res.status(201).json({ message: 'User registered successfully', user_id: this.lastID });
    }
  );
});

// ------------------- LOGIN -------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, base_id: user.base_id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  });
});

module.exports = router; // VERY IMPORTANT