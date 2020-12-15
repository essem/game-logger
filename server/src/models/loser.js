module.exports = (sequelize) => {
  const loser = sequelize.define('loser', {});

  loser.associate = (models) => {
    loser.belongsTo(models.player);
    loser.belongsTo(models.game);
  };

  return loser;
};
