'use strict';

const route = require('koa-route');
const parse = require('co-body');
const models = require('./models');

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
    ret.games = yield event.getGames();
    this.body = JSON.stringify(event);
  }));

  app.use(route.put('/api/events/:id', function* updateEvent(id) {
    const body = yield parse.json(this);
    const event = yield models.event.findOne({
      where: { id },
    });
    if (body.finished) {
      event.finished = true; // un-finish is not allowed

      const player = yield models.player.findOne({
        attributes: [[models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count']],
        where: { eventId: id },
      });
      const playerCount = player.get('count');

      const game = yield models.game.findOne({
        attributes: [[models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count']],
        where: { eventId: id },
      });
      const gameCount = game.get('count');

      const mostWin = yield models.game.findOne({
        attributes: [
          'winnerId',
          [
            models.sequelize.fn('COUNT', models.sequelize.col('id')),
            'count',
          ],
        ],
        group: ['winnerId'],
        where: { eventId: id },
        order: 'count DESC',
        limit: 1,
      });
      const mostWinCount = mostWin.get('count');

      const mostWinner = yield models.player.findOne({
        where: { id: mostWin.winnerId },
      });

      event.summary = `${playerCount} players played ${gameCount} games.\n` +
                      `Most wins: ${mostWinCount} wins by ${mostWinner.name}`;
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
    this.body = JSON.stringify(newPlayer);
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
      winnerId: body.winnerId,
      loserId: body.loserId,
    });
    this.body = JSON.stringify(newGame);
  }));

  app.use(route.delete('/api/events/:eventId/games/:id', function* createGame(eventId, id) {
    const event = yield models.event.findOne({
      where: { eventId },
    });
    if (event.finished) {
      this.status = 400;
      return;
    }
    yield models.game.destroy({
      where: { id, eventId },
    });
    this.body = JSON.stringify({ id: parseInt(id, 10) });
  }));
}

module.exports = init;
