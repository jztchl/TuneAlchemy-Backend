module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    title: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    genreId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Genres', key: 'id' } },
    duration: { type: DataTypes.INTEGER, allowNull: true },
  });

  Song.associate = function(models) {
    Song.belongsTo(models.Artist, { foreignKey: 'artistId', as: 'artist' });
    Song.belongsToMany(models.Playlist, { through: 'PlaylistSongs', as: 'playlists' });
    Song.belongsTo(models.Genre, { foreignKey: 'genreId', as: 'genre' });
  };

  return Song;
};
