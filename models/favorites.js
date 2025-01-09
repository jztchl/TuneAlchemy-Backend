module.exports = (sequelize, DataTypes) => {
    const Favorites = sequelize.define('Favorites', {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        songId: { type: DataTypes.INTEGER, allowNull: false },
    });

    Favorites.associate = function(models) {
        Favorites.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Favorites.belongsTo(models.Song, { foreignKey: 'songId', as: 'song' });
    };

    return Favorites;
};