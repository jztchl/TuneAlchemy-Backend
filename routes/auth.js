const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_refresh_secret', { expiresIn: '7d' });
    res.status(200).json({ token: accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
