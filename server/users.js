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

  app.use(route.get('/api/users/:id', function* showUser(id) {
    const user = yield models.user.findOne({
      where: { id },
    });
    const ret = {
      id: user.id,
      name: user.name,
      users: {},
    };

    // Make user id to name map
    const users = yield models.user.findAll();
    for (const u of users) {
      ret.users[u.id] = u.name;
    }

    // TODO: make code scalable

    // Get all games that user played
    const players = yield user.getPlayers();
    const games = [];
    for (const player of players) {
      const winners = yield player.getWinners();
      for (const winner of winners) {
        const game = yield winner.getGame();
        games.push(game);
      }
      const losers = yield player.getLosers();
      for (const loser of losers) {
        const game = yield loser.getGame();
        games.push(game);
      }
    }

    // Fill game winners and losers with user id
    ret.games = [];
    for (const game of games) {
      const outGame = { winners: [], losers: [] };
      const winners = yield game.getWinners();
      for (const winner of winners) {
        const player = yield winner.getPlayer();
        const u = yield player.getUser();
        outGame.winners.push(u.id);
      }
      const losers = yield game.getLosers();
      for (const loser of losers) {
        const player = yield loser.getPlayer();
        const u = yield player.getUser();
        outGame.losers.push(u.id);
      }
      ret.games.push(outGame);
    }

    this.body = JSON.stringify(ret);
  }));
}

module.exports = init;
