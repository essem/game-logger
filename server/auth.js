'use strict';

const route = require('koa-route');
const config = require('config');
const jwt = require('jsonwebtoken');
const models = require('./models');

function* authenticate(account, password) {
  const user = yield models.user.findOne({
    where: {
      $and: [
        { name: account },
        models.sequelize.where(
          models.sequelize.fn('crypt', password, models.sequelize.col('password')),
          models.sequelize.col('password')
        ),
      ],
    },
  });
  return user;
}

function init(app) {
  app.use(function* middleware(next) {
    const token = this.headers['x-access-token'];
    if (token) {
      try {
        const decoded = jwt.verify(token, config.auth.secret);
        this.account = decoded.account;
        this.admin = decoded.admin;
      } catch (err) {} // eslint-disable-line no-empty
    }
    yield next;
  });

  app.use(route.post('/api/login', function* login() {
    const req = this.request.body;
    const user = yield authenticate(req.account, req.password);
    if (!user) {
      this.body = JSON.stringify({
        token: null,
      });
      return;
    }

    const info = { account: user.name, admin: user.admin };
    const token = jwt.sign(info, config.auth.secret, {
      expiresIn: '24h',
    });

    this.body = JSON.stringify({
      token,
    });
  }));
}

module.exports = init;
