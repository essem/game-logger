'use strict';

const koa = require('koa');
const cors = require('koa-cors');
const send = require('koa-send');
const session = require('koa-session');
const morgan = require('koa-morgan');
const config = require('config');
const logger = require('./logger');
const ws = require('./websocket');
const models = require('./models');
const auth = require('./auth');
const events = require('./events');

function createKoa(hostname, port) {
  const app = koa();

  const stream = {
    write(message) {
      logger.info(message.slice(0, -1));
    },
  };
  app.use(morgan.middleware('combined', { stream }));

  if (config.get('cors')) {
    app.use(cors({ credentials: true }));
  }

  app.keys = config.auth.keys;
  app.use(session(app));

  auth(app);
  events(app);

  if (config.get('serveStatic')) {
    app.use(require('koa-static')('dist')); // eslint-disable-line global-require
  }

  app.use(function* index() {
    yield send(this, 'dist/index.html');
  });

  const httpServer = app.listen(port, hostname);

  const envStr = process.env.NODE_ENV || 'development';
  logger.info(`server is started on ${hostname}:${port} in ${envStr} mode`);

  ws.createServer(httpServer);

  return httpServer;
}

function createServer(hostname, port) {
  return models.sequelize.sync()
  .then(() => {
    createKoa(hostname, port);
  });
}

module.exports = createServer;
