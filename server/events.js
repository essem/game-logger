'use strict';

const route = require('koa-route');
const _ = require('lodash');
const models = require('./models');
const websocket = require('./websocket');
const logger = require('./logger');

function init(app) {
  app.use(route.get('/api/events', function* listEvents() {
    const events = yield models.event.findAll({
      order: [['createdAt', 'DESC']],
    });
    this.body = JSON.stringify(events);
  }));

  app.use(route.post('/api/events', function* createEvent() {
    const req = this.request.body;
    const newEvent = yield models.event.create({ name: req.name });
    this.body = JSON.stringify(newEvent);
  }));

  app.use(route.get('/api/events/:id', function* showEvent(id) {
    const event = yield models.event.findOne({
      where: { id },
    });
    const ret = event.toJSON();
    const players = yield event.getPlayers();
    ret.players = [];
    for (const player of players) {
      const p = player.toJSON();
      const user = yield player.getUser();
      p.user = user.toJSON();
      ret.players.push(p);
    }
    const games = yield event.getGames();
    ret.games = [];
    for (const game of games) {
      const g = game.toJSON();
      const winners = yield game.getWinners();
      g.winners = winners.map(w => w.playerId);
      const losers = yield game.getLosers();
      g.losers = losers.map(l => l.playerId);
      ret.games.push(g);
    }
    this.body = JSON.stringify(ret);
  }));

  app.use(route.put('/api/events/:id', function* updateEvent(id) {
    const req = this.request.body;
    const event = yield models.event.findOne({
      where: { id },
    });
    if (req.finished === true) {
      event.finished = true;

      const player = yield models.player.findOne({
        attributes: [[models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count']],
        where: { eventId: id },
      });
      const playerCount = player.get('count');

      const game = yield models.game.findAll({
        attributes: ['id'],
        where: { eventId: id },
      });
      const gameCount = game.length;

      const mostWin = yield models.winner.findOne({
        attributes: [
          'playerId',
          [
            models.sequelize.fn('COUNT', models.sequelize.col('id')),
            'count',
          ],
        ],
        group: ['playerId'],
        where: { gameId: game.map(g => g.id) },
        order: 'count DESC',
        limit: 1,
      });
      const mostWinCount = mostWin.get('count');

      const mostWinner = yield models.player.findOne({
        where: { id: mostWin.playerId },
      });

      event.summary = `${playerCount} players played ${gameCount} games.\n` +
                      `Most wins: ${mostWinCount} wins by ${mostWinner.name}`;
    } else if (req.finished === false) {
      if (!this.admin) {
        this.status = 401;
        return;
      }
      event.finished = false;
    }

    yield event.save();
    this.body = JSON.stringify({ id });
  }));

  app.use(route.delete('/api/events/:id', function* deleteEvent(id) {
    if (!this.admin) {
      this.status = 401;
      return;
    }

    const event = yield models.event.findOne({
      where: { id },
    });

    yield event.destroy();

    this.body = JSON.stringify({ id });
  }));

  app.use(route.post('/api/events/:id/players', function* createPlayer(id) {
    const req = this.request.body;
    const event = yield models.event.findOne({
      where: { id },
    });
    if (event.finished) {
      this.status = 400;
      return;
    }
    const players = [];
    for (const userId of req.users) {
      const player = yield models.player.create({ eventId: id, userId });
      const p = player.toJSON();
      const user = yield player.getUser();
      p.user = user.toJSON();
      players.push(p);
    }

    this.status = 200;
    websocket.send(id, { type: 'createPlayers', players });
  }));

  app.use(route.delete('/api/events/:eventId/players/:id', function* deleteGame(eventId, id) {
    const intId = parseInt(id, 10);

    const event = yield models.event.findOne({
      where: { id: eventId },
    });

    if (event.finished) {
      logger.warn(`try to delete game in finished event:${eventId}`);
      this.status = 400;
      return;
    }

    const players = yield event.getPlayers({ where: { id } });
    if (players.length !== 1) {
      logger.warn(`invalid player id:${id}`);
      return;
    }

    let found = false;
    const games = yield event.getGames();
    for (const game of games) {
      const winners = yield game.getWinners();
      if (_.some(winners, winner => winner.playerId === intId)) {
        found = true;
        break;
      }
      const losers = yield game.getLosers();
      if (_.some(losers, loser => loser.playerId === intId)) {
        found = true;
        break;
      }
    }
    if (found) {
      logger.warn('the player already play a game');
      return;
    }

    yield players[0].destroy();

    this.status = 200;
    websocket.send(eventId, { type: 'deletePlayer', playerId: parseInt(id, 10) });
  }));

  app.use(route.post('/api/events/:id/games', function* createGame(id) {
    const req = this.request.body;
    const event = yield models.event.findOne({
      where: { id },
    });
    if (event.finished) {
      this.status = 400;
      return;
    }
    const newGame = yield models.game.create({
      eventId: id,
    });

    const ret = newGame.toJSON();
    ret.winners = [];
    ret.losers = [];

    for (const playerId of req.winners) {
      yield models.winner.create({
        gameId: newGame.id,
        playerId,
      });
      ret.winners.push(playerId);
    }

    for (const playerId of req.losers) {
      yield models.loser.create({
        gameId: newGame.id,
        playerId,
      });
      ret.losers.push(playerId);
    }

    this.status = 200;
    websocket.send(id, { type: 'createGame', game: newGame });
  }));

  app.use(route.delete('/api/events/:eventId/games/:id', function* deleteGame(eventId, id) {
    const event = yield models.event.findOne({
      where: { id: eventId },
    });
    if (event.finished) {
      logger.info(`try to delete game in finished event:${eventId}`);
      this.status = 400;
      return;
    }
    const games = yield event.getGames({ where: { id } });
    if (games.length !== 1) {
      logger.info(`invalid game id:${id}`);
      return;
    }

    yield games[0].destroy();

    this.status = 200;
    websocket.send(eventId, { type: 'deleteGame', gameId: parseInt(id, 10) });
  }));
}

module.exports = init;
