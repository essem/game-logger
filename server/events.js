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

  app.use(route.get('/api/event/:id', function* showEvent(id) {
    const event = yield models.event.findOne({
      where: { id },
    });
    const ret = event.toJSON();
    ret.players = yield event.getPlayers();
    ret.games = yield event.getGames();
    this.body = JSON.stringify(event);
  }));

  app.use(route.post('/api/events/:id/players', function* createPlayer(id) {
    const body = yield parse.json(this);
    const newPlayer = yield models.player.create({ eventId: id, name: body.name });
    this.body = JSON.stringify(newPlayer);
  }));

  app.use(route.post('/api/events/:id/games', function* createGame(id) {
    const body = yield parse.json(this);
    const newGame = yield models.game.create({
      eventId: id,
      winnerId: body.winnerId,
      loserId: body.loserId,
    });
    this.body = JSON.stringify(newGame);
  }));

  app.use(route.delete('/api/events/:eventId/games/:id', function* createGame(eventId, id) {
    yield models.game.destroy({
      where: { id, eventId },
    });
    this.body = JSON.stringify({ id: parseInt(id, 10) });
  }));
}

module.exports = init;
