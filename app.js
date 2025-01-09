const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Import morgan
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');
const artistRoutes = require('./routes/artists');
const userRoutes = require('./routes/users');
const recentlyPlayedRoutes = require('./routes/recentlyPlayed');
const recommendationsRoutes = require('./routes/recommendations');
const genresRoutes = require('./routes/genres');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Morgan middleware for logging requests
app.use(morgan(':method :url :status - :response-time ms'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recently-played', recentlyPlayedRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/genres', genresRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
