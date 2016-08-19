'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'events',
      'finished',
      Sequelize.BOOLEAN
    );
  },
};
