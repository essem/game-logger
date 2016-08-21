'use strict';

module.exports = sequelize => {
  const game = sequelize.define('game', {
  }, {
    classMethods: {
      associate: models => {
        game.hasMany(models.winner);
        game.hasMany(models.loser);
      },
    },
  });

  return game;
};
