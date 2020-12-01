const route = require('koa-route');
const _ = require('lodash');
const models = require('./models');
const websocket = require('./websocket');
const logger = require('./logger');

const { Op } = models.Sequelize;

function init(app) {
  app.use(
    route.get('/api/events', async (ctx) => {
      const options = {
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit: 10,
      };

      if (ctx.query.createdAt && ctx.query.id) {
        options.where = {
          [Op.or]: [
            { createdAt: { [Op.lt]: ctx.query.createdAt } },
            {
              [Op.and]: [
                { createdAt: ctx.query.createdAt },
                { id: { [Op.lt]: ctx.query.id } },
              ],
            },
          ],
        };
      }

      const events = await models.event.findAll(options);
      ctx.body = JSON.stringify({ list: events });
    }),
  );

  app.use(
    route.post('/api/events', async (ctx) => {
      const req = ctx.request.body;
      const newEvent = await models.event.create({ name: req.name });
      ctx.body = JSON.stringify(newEvent);
    }),
  );

  app.use(
    route.get('/api/events/:id', async (ctx, id) => {
      const event = await models.event.findOne({
        where: { id },
      });
      const ret = event.toJSON();
      const players = await event.getPlayers();
      ret.players = await Promise.all(
        players.map(async (player) => {
          const p = player.toJSON();
          const user = await player.getUser();
          p.user = user.toJSON();
          return p;
        }),
      );
      const games = await event.getGames();
      ret.games = await Promise.all(
        games.map(async (game) => {
          const g = game.toJSON();
          const winners = await game.getWinners();
          g.winners = winners.map((w) => w.playerId);
          const losers = await game.getLosers();
          g.losers = losers.map((l) => l.playerId);
          return g;
        }),
      );
      ctx.body = JSON.stringify(ret);
    }),
  );

  app.use(
    route.put('/api/events/:id/finish', async (ctx, id) => {
      const event = await models.event.findOne({
        where: { id },
      });
      if (!event) {
        ctx.status = 400;
        return;
      }

      const game = await models.game.findAll({
        attributes: ['id'],
        where: { eventId: id },
      });
      const gameCount = game.length;
      if (gameCount === 0) {
        ctx.status = 400;
        return;
      }

      const player = await models.player.findOne({
        attributes: [
          [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count'],
        ],
        where: { eventId: id },
      });
      const playerCount = player.get('count');

      const mostWin = await models.winner.findOne({
        attributes: [
          'playerId',
          [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count'],
        ],
        group: ['playerId'],
        where: { gameId: game.map((g) => g.id) },
        order: 'count DESC',
        limit: 1,
      });
      const mostWinCount = mostWin.get('count');

      const mostWinner = await models.player.findOne({
        include: {
          model: models.user,
        },
        where: { id: mostWin.playerId },
      });

      event.finished = true;
      event.summary =
        `${playerCount} players played ${gameCount} games.\n` +
        `Most wins: ${mostWinCount} wins by ${mostWinner.user.name}`;

      await event.save();

      ctx.status = 200;
      websocket.send(id, { type: 'finish' });
    }),
  );

  app.use(
    route.put('/api/events/:id/reopen', async (ctx, id) => {
      if (!ctx.admin) {
        ctx.status = 401;
        return;
      }

      const event = await models.event.findOne({
        where: { id },
      });
      event.finished = false;
      await event.save();

      ctx.body = JSON.stringify({ id });
    }),
  );

  app.use(
    route.put('/api/events/:id', async (ctx, id) => {
      // const req = ctx.request.body;
      const event = await models.event.findOne({
        where: { id },
      });

      // TODO: Update allowed fields

      await event.save();
      ctx.body = JSON.stringify({ id });
    }),
  );

  app.use(
    route.delete('/api/events/:id', async (ctx, id) => {
      if (!ctx.admin) {
        ctx.status = 401;
        return;
      }

      const event = await models.event.findOne({
        where: { id },
      });

      await event.destroy();

      ctx.body = JSON.stringify({ id });
    }),
  );

  app.use(
    route.post('/api/events/:id/players', async (ctx, id) => {
      const req = ctx.request.body;
      const event = await models.event.findOne({
        where: { id },
      });
      if (event.finished) {
        ctx.status = 400;
        return;
      }
      const players = await Promise.all(
        req.users.map(async (userId) => {
          const player = await models.player.create({ eventId: id, userId });
          const p = player.toJSON();
          const user = await player.getUser();
          p.user = user.toJSON();
          return p;
        }),
      );

      ctx.status = 200;
      websocket.send(id, { type: 'createPlayers', players });
    }),
  );

  app.use(
    route.delete(
      '/api/events/:eventId/players/:id',
      async (ctx, eventId, id) => {
        const intId = parseInt(id, 10);

        const event = await models.event.findOne({
          where: { id: eventId },
        });

        if (event.finished) {
          logger.warn(`try to delete game in finished event:${eventId}`);
          ctx.status = 400;
          return;
        }

        const players = await event.getPlayers({ where: { id } });
        if (players.length !== 1) {
          logger.warn(`invalid player id:${id}`);
          return;
        }

        let found = false;
        const games = await event.getGames();
        for (const game of games) {
          const winners = await game.getWinners(); // eslint-disable-line no-await-in-loop
          if (_.some(winners, (winner) => winner.playerId === intId)) {
            found = true;
            break;
          }
          const losers = await game.getLosers(); // eslint-disable-line no-await-in-loop
          if (_.some(losers, (loser) => loser.playerId === intId)) {
            found = true;
            break;
          }
        }
        if (found) {
          logger.warn('the player already played a game');
          return;
        }

        await players[0].destroy();

        ctx.status = 200;
        websocket.send(eventId, {
          type: 'deletePlayer',
          playerId: parseInt(id, 10),
        });
      },
    ),
  );

  app.use(
    route.post('/api/events/:id/games', async (ctx, id) => {
      const req = ctx.request.body;
      const event = await models.event.findOne({
        where: { id },
      });
      if (event.finished) {
        ctx.status = 400;
        return;
      }
      const newGame = await models.game.create({
        eventId: id,
      });

      const ret = newGame.toJSON();
      ret.winners = await Promise.all(
        req.winners.map(async (playerId) => {
          await models.winner.create({
            gameId: newGame.id,
            playerId,
          });
          return playerId;
        }),
      );
      ret.losers = await Promise.all(
        req.losers.map(async (playerId) => {
          await models.loser.create({
            gameId: newGame.id,
            playerId,
          });
          return playerId;
        }),
      );

      ctx.status = 200;
      websocket.send(id, { type: 'createGame', game: newGame });
    }),
  );

  app.use(
    route.delete('/api/events/:eventId/games/:id', async (ctx, eventId, id) => {
      const event = await models.event.findOne({
        where: { id: eventId },
      });
      if (event.finished) {
        logger.info(`try to delete game in finished event:${eventId}`);
        ctx.status = 400;
        return;
      }
      const games = await event.getGames({ where: { id } });
      if (games.length !== 1) {
        logger.info(`invalid game id:${id}`);
        return;
      }

      await games[0].destroy();

      ctx.status = 200;
      websocket.send(eventId, { type: 'deleteGame', gameId: parseInt(id, 10) });
    }),
  );
}

module.exports = init;
