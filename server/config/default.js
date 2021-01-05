module.exports = {
  hostname: '0.0.0.0',
  port: 5000,
  subUri: '',
  serveStatic: false,
  auth: {
    secret: process.env.GL_AUTH_SECRET || 'some secret hurr',
  },
  database: {
    host: process.env.GL_DB_HOST || 'localhost',
    port: process.env.GL_DB_PORT || 5432,
    db: process.env.GL_DB_NAME || 'gameLogger',
    username: process.env.GL_DB_USER || 'gameLogger',
    password: process.env.GL_DB_PASS || 'gameLogger',
  },
  log: {
    level: 'debug',
  },
};
