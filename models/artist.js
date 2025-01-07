module.exports = (sequelize, DataTypes) => {
    const Artist = sequelize.define('Artist', {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    });
  
    Artist.associate = function(models) {
      Artist.hasMany(models.Song, { foreignKey: 'artistId', as: 'songs' });
    };
  
    return Artist;
  };
  