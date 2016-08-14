'use strict';

module.exports = sequelize => {
  const game = sequelize.define('game', {
  }, {
    classMethods: {
      associate: models => {
        game.belongsTo(models.player, { as: 'winner' });
        game.belongsTo(models.player, { as: 'loser' });
      },
    },
  });

  return game;
};
