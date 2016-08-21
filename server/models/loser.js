'use strict';

module.exports = sequelize => {
  const loser = sequelize.define('loser', {
  }, {
    classMethods: {
      associate: models => {
        loser.belongsTo(models.player);
      },
    },
  });

  return loser;
};