module.exports = (sequelize) => {
  const winner = sequelize.define(
    'winner',
    {},
    {
      classMethods: {
        associate: (models) => {
          winner.belongsTo(models.player);
          winner.belongsTo(models.game);
        },
      },
    },
  );

  return winner;
};
