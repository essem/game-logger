'use strict';

const route = require('koa-route');
const models = require('./models');

function init(app) {
  app.use(route.get('/api/users', function* listUsers() {
    const users = yield models.user.findAll();
    this.body = JSON.stringify(users);
  }));

  app.use(route.post('/api/users', function* createUser() {
    if (!this.admin) {
      this.status = 401;
      return;
    }

    const req = this.request.body;
    const newUser = yield models.user.create({
      name: req.name,
      password: models.sequelize.fn('crypt',
        req.password,
        models.sequelize.fn('gen_salt', 'bf', 8)
      ),
      admin: false,
    });
    this.body = JSON.stringify(newUser);
  }));
}

module.exports = init;
