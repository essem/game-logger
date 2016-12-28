'use strict';

module.exports = (sequelize) => {
  const game = sequelize.define('game', {
  }, {
    classMethods: {
      associate: (models) => {
        game.hasMany(models.winner, { onDelete: 'cascade', hooks: true });
        game.hasMany(models.loser, { onDelete: 'cascade', hooks: true });
      },
    },
  });

  return game;
};
