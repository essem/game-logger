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
    const out = {
      id: user.id,
      name: user.name,
      users: {},
      events: [],
    };

    // Make user id to name map
    const users = yield models.user.findAll();
    for (const u of users) {
      out.users[u.id] = u.name;
    }

    // TODO: make code scalable

    // Get all events that user played
    const players = yield user.getPlayers();
    for (const player of players) {
      const event = yield player.getEvent();
      const games = yield event.getGames();

      const outEvent = { id: event.id, name: event.name, games: [] };

      for (const game of games) {
        const winners = yield game.getWinners();
        if (winners.some(winner => winner.playerId === player.id)) {
          outEvent.games.push(game);
        } else {
          const losers = yield game.getLosers();
          if (losers.some(loser => loser.playerId === player.id)) {
            outEvent.games.push(game);
          }
        }
      }
      if (outEvent.games.length > 0) {
        out.events.push(outEvent);
      }
    }

    // Fill game winners and losers with user id
    for (const event of out.events) {
      const outGames = [];
      for (const game of event.games) {
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
        outGames.push(outGame);
      }
      event.games = outGames;
    }

    this.body = JSON.stringify(out);
  }));
}

module.exports = init;
