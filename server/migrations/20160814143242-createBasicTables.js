module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.resolve()
      .then(() =>
        queryInterface.createTable('events', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.STRING,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }),
      )
      .then(() =>
        queryInterface.createTable('games', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          eventId: Sequelize.INTEGER,
          winnerId: Sequelize.INTEGER,
          loserId: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }),
      )
      .then(() =>
        queryInterface.createTable('players', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.STRING,
          eventId: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }),
      );
  },
};
