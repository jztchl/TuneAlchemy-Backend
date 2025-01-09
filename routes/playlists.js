const express = require('express');
const { Playlist, Song } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Create a new playlist
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const userId = req.user.id;

    const newPlaylist = await Playlist.create({
      name,
      isPublic,
      userId,
    });

    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a song to a playlist
router.post('/:playlistId/songs', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.body;
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    await playlist.addSong(song);
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a song from a playlist
router.delete('/:playlistId/songs/:songId', authMiddleware, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const songId = req.params.songId;
    const userId = req.user.id;

    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    await playlist.removeSong(song);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all playlists for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await Playlist.findAll({ where: { userId } });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific playlist
router.get('/:playlistId', authMiddleware, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    const playlist = await Playlist.findOne({
      where: { id: playlistId, userId },
      include: {
        model: Song,
        as: 'songs',
        through: { attributes: [] }
      }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Share a playlist
router.post('/:playlistId/share', authMiddleware, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    playlist.isPublic = true;
    await playlist.save();
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a playlist
router.delete('/:playlistId', authMiddleware, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    await playlist.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
