module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: 'user' },
      hoursListened: { type: DataTypes.FLOAT, defaultValue: 0 },
      profilePicture: { type: DataTypes.STRING, allowNull: true },
      bio: { type: DataTypes.TEXT, allowNull: true },
      dateOfBirth: { type: DataTypes.DATE, allowNull: true },
    });
  
    User.associate = function(models) {
      User.hasMany(models.Playlist, { foreignKey: 'userId', as: 'playlists' });
    };
  
    return User;
  };
  