const express = require('express');
const { User } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;
    const user = await User.findByPk(userId);
    user.username = username;
    user.email = email;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
