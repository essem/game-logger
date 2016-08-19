'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'events',
      'summary',
      Sequelize.STRING
    );
  },
};
