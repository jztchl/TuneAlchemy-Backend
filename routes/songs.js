const express = require('express');
const multer = require('multer');
const { Song, Artist } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Upload a new song (admin only)
router.post('/upload', authMiddleware, adminMiddleware, upload.single('songFile'), async (req, res) => {
  try {
    const { title, artistId } = req.body;
    const filePath = req.file.path;

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const newSong = await Song.create({
      title,
      filePath,
      artistId,
    });

    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.findAll({ include: { model: Artist, as: 'artist' } });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stream a song
router.get('/stream/:id', async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const filePath = song.filePath;
    res.sendFile(filePath, { root: './' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
