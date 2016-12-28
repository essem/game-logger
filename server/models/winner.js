'use strict';

module.exports = (sequelize) => {
  const winner = sequelize.define('winner', {
  }, {
    classMethods: {
      associate: (models) => {
        winner.belongsTo(models.player);
      },
    },
  });

  return winner;
};
