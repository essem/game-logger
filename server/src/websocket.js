const WebSocketServer = require('websocket').server;
const logger = require('./logger');

const eventWatchers = new Map();

function handleWatch(socket, eventId) {
  if (socket.watchEventId) {
    const watchers = eventWatchers.get(socket.watchEventId);
    watchers.delete(socket);
    logger.info(
      `websocket:${socket.remoteAddress}:unwatch:${socket.watchEventId}`,
    );
  }

  let watchers = eventWatchers.get(eventId);
  if (!watchers) {
    watchers = new Set();
    eventWatchers.set(eventId, watchers);
  }

  watchers.add(socket);
  Object.assign(socket, { watchEventId: eventId });
  logger.info(`websocket:${socket.remoteAddress}:watch:${eventId}`);
}

function handleMessage(socket, utf8Data) {
  try {
    const message = JSON.parse(utf8Data);
    switch (message.type) {
      case 'watch':
        handleWatch(socket, message.eventId);
        break;
      default:
        logger.warn(
          `websocket:${socket.remoteAddress}:invalid message type:${utf8Data}`,
        );
        socket.drop();
    }
  } catch (e) {
    logger.warn(
      `websocket:${socket.remoteAddress}:failed to handle message:${utf8Data}`,
    );
    logger.warn(e);
    socket.drop();
  }
}

function handleClose(socket, reasonCode, description) {
  if (socket.watchEventId) {
    const watchers = eventWatchers.get(socket.watchEventId);
    watchers.delete(socket);
    logger.info(
      `websocket:${socket.remoteAddress}:unwatch:${socket.watchEventId}`,
    );
  }

  logger.info(`websocket:${socket.remoteAddress}:close`);
  logger.info(`  ${reasonCode}, ${description}`);
}

function createServer(httpServer) {
  const wsServer = new WebSocketServer({
    httpServer,
    autoAcceptConnections: false,
  });

  wsServer.on('request', (request) => {
    try {
      // TODO: check origin

      const socket = request.accept('watch', request.origin);
      logger.info(`websocket:${socket.remoteAddress}:accept`);

      socket.on('message', (message) => {
        if (message.type !== 'utf8') {
          logger.warn(`websocket: invalid message type ${message.type}`);
          socket.drop();
          return;
        }

        handleMessage(socket, message.utf8Data);
      });

      socket.on('close', (reasonCode, description) => {
        handleClose(socket, reasonCode, description);
      });
    } catch (e) {
      logger.warn('failed to accept websocket connection');
      logger.warn(e);
    }
  });

  logger.info('websocket server is started');
}

function send(eventId, message) {
  const watchers = eventWatchers.get(parseInt(eventId, 10));
  if (!watchers) {
    logger.warn(`no watcher for ${eventId}`);
    return;
  }

  for (const socket of watchers.values()) {
    socket.sendUTF(JSON.stringify(message));
  }
}

module.exports = {
  createServer,
  send,
};
