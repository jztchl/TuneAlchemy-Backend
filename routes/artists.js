const express = require('express');
const { Artist, Song } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

// Create a new artist (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const newArtist = await Artist.create({ name });
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get songs by artist
router.get('/:artistId/songs', async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const songs = await Song.findAll({ where: { artistId } });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      const artists = await Artist.findAll({
        where: {
          name: {
            [Op.iLike]: `%${query}%`
          }
        }
      });
      res.status(200).json(artists);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
