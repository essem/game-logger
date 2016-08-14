'use strict';

module.exports = (sequelize, DataTypes) => {
  const player = sequelize.define('player', {
    name: DataTypes.STRING,
  });

  return player;
};
