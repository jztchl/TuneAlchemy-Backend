const express = require('express');
const multer = require('multer');
const { User } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
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

// Update user profile picture
router.put('/profile/picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const profilePicturePath = req.file ? req.file.path : null; // Get the profile picture path if uploaded
    user.profilePicture = profilePicturePath; // Update the user's profile picture path
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/list', authMiddleware,adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
