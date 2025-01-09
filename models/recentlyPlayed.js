module.exports = (sequelize, DataTypes) => {
    const RecentlyPlayed = sequelize.define('RecentlyPlayed', {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      songId: { type: DataTypes.INTEGER, allowNull: false },
    });
  
    RecentlyPlayed.associate = function(models) {
      RecentlyPlayed.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      RecentlyPlayed.belongsTo(models.Song, { foreignKey: 'songId', as: 'song' });
    };
  
    return RecentlyPlayed;
  };
  