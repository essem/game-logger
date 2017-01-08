'use strict';

module.exports = (sequelize) => {
  const player = sequelize.define('player', {
  }, {
    classMethods: {
      associate: (models) => {
        player.belongsTo(models.user);
        player.hasMany(models.winner);
        player.hasMany(models.loser);
      },
    },
  });

  return player;
};
