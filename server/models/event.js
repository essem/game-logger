'use strict';

module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    name: DataTypes.STRING,
  }, {
    classMethods: {
      associate: models => {
        event.hasMany(models.player);
        event.hasMany(models.game);
      },
    },
  });

  return event;
};
