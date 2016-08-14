'use strict';

const route = require('koa-route');
const parse = require('co-body');
const models = require('./models');

function init(app) {
  app.use(route.get('/api/events', function* listEvents() {
    const events = yield models.Event.findAll({
      order: [['createdAt', 'DESC']],
    });
    this.body = JSON.stringify(events);
  }));

  app.use(route.post('/api/events', function* createTodo() {
    const body = yield parse.json(this);
    const newEvent = yield models.Event.create({ name: body.name });
    this.body = JSON.stringify(newEvent);
  }));
}

module.exports = init;
