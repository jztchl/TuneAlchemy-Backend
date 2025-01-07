module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define('Playlist', {
      name: { type: DataTypes.STRING, allowNull: false },
      isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
    });
  
    Playlist.associate = function(models) {
      Playlist.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Playlist.belongsToMany(models.Song, { through: 'PlaylistSongs', as: 'songs' });
    };
  
    return Playlist;
  };
  