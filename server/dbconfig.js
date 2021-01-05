const config = require('config');

module.exports = {
  username: config.database.username,
  password: config.database.password,
  database: config.database.db,
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres',
};
