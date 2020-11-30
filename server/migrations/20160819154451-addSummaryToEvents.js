module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'events',
      'summary',
      Sequelize.STRING
    );
  },
};
