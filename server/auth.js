'use strict';

const route = require('koa-route');
const parse = require('co-body');
const config = require('config');

function authenticate(account, password) {
  return account === config.auth.account && password === config.auth.password;
}

function init(app) {
  app.use(route.post('/api/login', function* login() {
    const body = yield parse.json(this);
    if (!authenticate(body.account, body.password)) {
      this.body = JSON.stringify({
        account: null,
      });
      return;
    }
    this.session.account = body.account;
    this.body = JSON.stringify({
      account: body.account,
      admin: true,
    });
  }));

  app.use(route.post('/api/logout', function* logout() {
    this.session = null;
    this.body = JSON.stringify({});
  }));
}

module.exports = init;
