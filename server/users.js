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
      include: {
        model: models.player,
        include: {
          model: models.event,
          include: {
            model: models.game,
            include: [{
              model: models.winner,
              include: {
                model: models.player,
                include: models.user,
              },
            },
            {
              model: models.loser,
              include: {
                model: models.player,
                include: models.user,
              },
            }],
          },
        },
      },
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

    // Get all events that user played
    for (const player of user.players) {
      const outEvent = { id: player.event.id, name: player.event.name, games: [] };

      for (const game of player.event.games) {
        if (game.winners.some(winner => winner.playerId === player.id)) {
          outEvent.games.push(game);
        } else if (game.losers.some(loser => loser.playerId === player.id)) {
          outEvent.games.push(game);
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
        for (const winner of game.winners) {
          outGame.winners.push(winner.player.user.id);
        }
        for (const loser of game.losers) {
          outGame.losers.push(loser.player.user.id);
        }
        outGames.push(outGame);
      }
      event.games = outGames;
    }

    this.body = JSON.stringify(out);
  }));
}

module.exports = init;
