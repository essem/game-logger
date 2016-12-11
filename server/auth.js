'use strict';

const route = require('koa-route');
const config = require('config');
const jwt = require('jsonwebtoken');

function authenticate(account, password) {
  return account === config.auth.account && password === config.auth.password;
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
    if (!authenticate(req.account, req.password)) {
      this.body = JSON.stringify({
        token: null,
      });
      return;
    }

    const user = { account: req.account, admin: true };
    const token = jwt.sign(user, config.auth.secret, {
      expiresIn: '24h',
    });

    this.body = JSON.stringify({
      token,
    });
  }));
}

module.exports = init;
