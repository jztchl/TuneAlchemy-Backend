const express = require('express');
const multer = require('multer');
const { Artist, Song } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const path = require('path');

// Set up multer for artist image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/artists/'); // Specify the folder for artist images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to avoid name collisions
  },
});

const upload = multer({ storage: storage });

// Create a new artist (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const imagePath = req.file ? req.file.path : null; // Get the image path if uploaded

    const newArtist = await Artist.create({ name, image: imagePath }); // Save the image path
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

// Search for artists
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
