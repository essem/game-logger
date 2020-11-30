module.exports = (sequelize) => {
  const player = sequelize.define(
    'player',
    {},
    {
      classMethods: {
        associate: (models) => {
          player.belongsTo(models.user);
          player.belongsTo(models.event);
          player.hasMany(models.winner);
          player.hasMany(models.loser);
        },
      },
    },
  );

  return player;
};
