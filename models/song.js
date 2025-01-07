module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    title: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false },
  });

  Song.associate = function(models) {
    Song.belongsTo(models.Artist, { foreignKey: 'artistId', as: 'artist' });
    Song.belongsToMany(models.Playlist, { through: 'PlaylistSongs', as: 'playlists' });
  };

  return Song;
};
