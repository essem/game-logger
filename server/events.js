'use strict';

const route = require('koa-route');
const parse = require('co-body');
const models = require('./models');
const websocket = require('./websocket');

function init(app) {
  app.use(route.get('/api/events', function* listEvents() {
    const events = yield models.event.findAll({
      order: [['createdAt', 'DESC']],
    });
    this.body = JSON.stringify(events);
  }));

  app.use(route.post('/api/events', function* createEvent() {
    const body = yield parse.json(this);
    const newEvent = yield models.event.create({ name: body.name });
    this.body = JSON.stringify(newEvent);
  }));

  app.use(route.get('/api/events/:id', function* showEvent(id) {
    const event = yield models.event.findOne({
      where: { id },
    });
    const ret = event.toJSON();
    ret.players = yield event.getPlayers();
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
    this.body = JSON.stringify(event);
  }));

  app.use(route.put('/api/events/:id', function* updateEvent(id) {
    const body = yield parse.json(this);
    const event = yield models.event.findOne({
      where: { id },
    });
    if (body.finished === true) {
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
    } else if (body.finished === false) {
      if (!this.session.account) {
        this.status = 401;
        return;
      }
      event.finished = false;
    }

    yield event.save();
    this.body = JSON.stringify({ id });
  }));

  app.use(route.post('/api/events/:id/players', function* createPlayer(id) {
    const body = yield parse.json(this);
    const event = yield models.event.findOne({
      where: { id },
    });
    if (event.finished) {
      this.status = 400;
      return;
    }
    const newPlayer = yield models.player.create({ eventId: id, name: body.name });

    this.status = 200;
    websocket.send(id, { type: 'createPlayer', player: newPlayer });
  }));

  app.use(route.post('/api/events/:id/games', function* createGame(id) {
    const body = yield parse.json(this);
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

    for (const playerId of body.winners) {
      yield models.winner.create({
        gameId: newGame.id,
        playerId,
      });
      ret.winners.push(playerId);
    }

    for (const playerId of body.losers) {
      yield models.loser.create({
        gameId: newGame.id,
        playerId,
      });
      ret.losers.push(playerId);
    }

    this.status = 200;
    websocket.send(id, { type: 'createGame', game: newGame });
  }));

  app.use(route.delete('/api/events/:eventId/games/:id', function* createGame(eventId, id) {
    const event = yield models.event.findOne({
      where: { id: eventId },
    });
    if (event.finished) {
      this.status = 400;
      return;
    }
    yield models.game.destroy({
      where: { id, eventId },
    });
    yield models.winner.destroy({
      where: { gameId: id },
    });
    yield models.loser.destroy({
      where: { gameId: id },
    });

    this.status = 200;
    websocket.send(eventId, { type: 'deleteGame', gameId: parseInt(id, 10) });
  }));
}

module.exports = init;
