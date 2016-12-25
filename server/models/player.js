'use strict';

module.exports = (sequelize) => {
  const player = sequelize.define('player', {
  }, {
    classMethods: {
      associate: models => {
        player.belongsTo(models.user);
      },
    },
  });

  return player;
};
