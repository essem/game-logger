module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.resolve()
      .then(() =>
        queryInterface.createTable('users', {
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
          name: Sequelize.STRING,
          password: Sequelize.STRING,
          admin: Sequelize.BOOLEAN,
        }),
      )
      .then(() =>
        queryInterface.sequelize.query(
          'INSERT INTO users(name, password, admin, "createdAt", "updatedAt") ' +
            "VALUES ('admin', crypt('admin', gen_salt('bf', 8)), true, now(), now());",
        ),
      )
      .then(() =>
        queryInterface.sequelize.query(
          'INSERT INTO users(name, "createdAt", "updatedAt") ' +
            'SELECT name, now(), now() FROM (SELECT DISTINCT name FROM players) A',
        ),
      )
      .then(() =>
        queryInterface.addColumn('players', 'userId', Sequelize.INTEGER),
      )
      .then(() =>
        queryInterface.sequelize.query(
          'UPDATE players SET "userId" = u.id ' +
            'FROM (SELECT id, name FROM users) u ' +
            'WHERE players.name = u.name',
        ),
      )
      .then(() => queryInterface.removeColumn('players', 'name'));

    // Make my account to admin
    // UPDATE users
    // SET password = crypt('password', gen_salt('bf', 8)), admin = true
    // WHERE name = 'myaccount';
  },
};
