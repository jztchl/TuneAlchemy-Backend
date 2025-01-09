const express = require('express');
const { Genre } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth'); // Optional: Use if you want to restrict access
const adminMiddleware = require('../middlewares/admin');
// Get all genres
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new genre (admin only)
router.post('/create', authMiddleware,adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    const newGenre = await Genre.create({ name });
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 