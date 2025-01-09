const express = require('express');
const { Favorites, Song, User } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Get song recommendations based on user's favorites
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the user's favorite songs
    const favorites = await Favorites.findAll({ where: { userId }, include: [{ model: Song, as: 'song' }] });

    if (favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found for recommendations.' });
    }

    // Extract song IDs from favorites
    const favoriteSongIds = favorites.map(fav => fav.songId);

    // Find other users who have similar favorites
    const similarFavorites = await Favorites.findAll({
      where: {
        songId: favoriteSongIds,
        userId: { [Op.ne]: userId } // Exclude the current user
      },
      include: [{ model: Song, as: 'song' }]
    });

    // Extract unique song IDs from similar users' favorites
    const recommendedSongIds = [...new Set(similarFavorites.map(fav => fav.songId))];

    // Get recommended songs
    const recommendedSongs = await Song.findAll({
      where: {
        id: recommendedSongIds
      }
    });

    res.status(200).json(recommendedSongs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 