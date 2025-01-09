const express = require('express');
const { RecentlyPlayed, Song, Artist } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Get recently played songs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const recentlyPlayed = await RecentlyPlayed.findAll({
      where: { userId },
      include: {
        model: Song,
        as: 'song',
        include: {
          model: Artist,
          as: 'artist'
        }
      },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });
    res.status(200).json(recentlyPlayed.map(rp => rp.song));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
