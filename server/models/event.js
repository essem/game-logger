'use strict';

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: DataTypes.STRING,
  }, {
    classMethods: {
      // associate: models => {
      //   Event.hasMany(models.Player);
      //   Event.hasMany(models.Game);
      // },
    },
  });

  return Event;
};
