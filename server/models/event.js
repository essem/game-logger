'use strict';

module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    name: DataTypes.STRING,
    finished: DataTypes.BOOLEAN,
    summary: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        event.hasMany(models.player, { onDelete: 'cascade', hooks: true });
        event.hasMany(models.game, { onDelete: 'cascade', hooks: true });
      },
    },
  });

  return event;
};
