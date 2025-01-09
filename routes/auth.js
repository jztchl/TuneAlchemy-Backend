const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { User } = require('../models');
const router = express.Router();
const path = require('path');

// Set up multer for user profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users/'); // Specify the folder for user profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to avoid name collisions
  },
});

const upload = multer({ storage: storage });

// Register
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Set default role to 'user' if not provided
    const userRole = role || 'user';

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicturePath = req.file ? req.file.path : null; // Get the profile picture path if uploaded

    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role: userRole, // Use the userRole variable
      profilePicture: profilePicturePath 
    });

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
    const accessToken = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '2d' });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_refresh_secret', { expiresIn: '7d' });
    res.status(200).json({ token: accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, 'your_jwt_refresh_secret');
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    const accessToken = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '2d' });
    res.status(200).json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
