const express = require('express');
const multer = require('multer');
const { Song, Artist,Genre, RecentlyPlayed } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const { Op } = require('sequelize');

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
router.post('/upload', authMiddleware, adminMiddleware, upload.fields([{ name: 'songFile' }, { name: 'image' }]), async (req, res) => {
  try {
    const { title, artistId, genre, duration } = req.body;
    const filePath = req.files['songFile'][0].path; 
    const imagePath = req.files['image'][0].path; 

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const newSong = await Song.create({
      title,
      filePath,
      artistId,
      image: imagePath, // Store the image path
      genre,
      duration: duration ? parseInt(duration) : null,
    });

    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.findAll({ 
      include: [
        { model: Artist, as: 'artist' },
        { model: Genre, as: 'genre' }
      ]
    });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stream a song
router.get('/stream/:id', authMiddleware, async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const filePath = song.filePath;
    res.sendFile(filePath, { root: './' }, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ error: 'Error sending file' });
      } else {
        // Add to recently played
        const userId = req.user.id;
        RecentlyPlayed.create({ userId, songId: song.id })
          .then(() => {
            // Ensure only the last 5 songs are kept
            return RecentlyPlayed.findAll({
              where: { userId },
              order: [['createdAt', 'DESC']],
              limit: 25,
            });
          })
          .then((recentlyPlayed) => {
            return RecentlyPlayed.destroy({
              where: { userId, id: { [Op.notIn]: recentlyPlayed.map(rp => rp.id) } }
            });
          })
          .catch((error) => {
            console.error('Error updating recently played:', error);
          });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a song (admin only)
router.delete('/delete/:songId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const songId = req.params.songId;

    // Find the song by ID
    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Delete the song
    await song.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
