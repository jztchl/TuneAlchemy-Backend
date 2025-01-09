const express = require('express');
const { Favorites, User, Song } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Add a song to favorites
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user.id;

    // Check if the song already exists in favorites
    const existingFavorite = await Favorites.findOne({ where: { userId, songId } });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Song is already in favorites' });
    }

    const favorite = await Favorites.create({ userId, songId });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all favorite songs for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorites.findAll({
      where: { userId },
      include: [{ model: Song, as: 'song' }],
    });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a song from favorites
router.delete('/:songId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    const favorite = await Favorites.findOne({ where: { userId, songId } });
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favorite.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 