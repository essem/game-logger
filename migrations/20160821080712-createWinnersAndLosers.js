module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.resolve()
    .then(() =>
      queryInterface.createTable('winners',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          createdAt: {
            type: Sequelize.DATE,
          },
          updatedAt: {
            type: Sequelize.DATE,
          },
          gameId: Sequelize.INTEGER,
          playerId: Sequelize.INTEGER,
        }
      )
    )
    .then(() =>
      queryInterface.createTable('losers',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          createdAt: {
            type: Sequelize.DATE,
          },
          updatedAt: {
            type: Sequelize.DATE,
          },
          gameId: Sequelize.INTEGER,
          playerId: Sequelize.INTEGER,
        }
      )
    )
    .then(() =>
      queryInterface.sequelize.query(
        'INSERT INTO winners("createdAt", "updatedAt", "gameId", "playerId") ' +
        'SELECT "createdAt", "updatedAt", id, "winnerId" FROM games'
      )
    )
    .then(() =>
      queryInterface.sequelize.query(
        'INSERT INTO losers("createdAt", "updatedAt", "gameId", "playerId") ' +
        'SELECT "createdAt", "updatedAt", id, "loserId" FROM games'
      )
    )
    .then(() => queryInterface.removeColumn('games', 'winnerId'))
    .then(() => queryInterface.removeColumn('games', 'loserId'));
  },
};
