module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('events', 'finished', Sequelize.BOOLEAN);
  },
};
