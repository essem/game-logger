const _ = require('lodash');
const moment = require('moment');
const route = require('koa-route');
const models = require('./models');

const { Op } = models.Sequelize;

function init(app) {
  app.use(
    route.get('/api/stats', async (ctx) => {
      const offset = _.clamp(parseInt(ctx.query.offset, 10), 0, 24);
      const months = _.clamp(parseInt(ctx.query.months, 10), 1, 12);

      // Calculate range
      const now = moment();
      const endDate = now.clone().add(1, 'months').subtract(offset, 'months');
      const beginDate = endDate.clone().subtract(months, 'months');

      // Make labels
      const labels = [];
      for (let i = 0; i < months; i += 1) {
        labels.push(beginDate.clone().add(i, 'months').format('YYYY-MM'));
      }

      // Query all events within range
      const events = await models.event.findAll({
        include: {
          model: models.game,
          include: [
            {
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
            },
          ],
        },
        where: {
          createdAt: {
            [Op.gte]: beginDate.format('YYYY-MM-01'),
            [Op.lt]: endDate.format('YYYY-MM-01'),
          },
        },
      });

      // Make user map with initial data
      const users = await models.user.findAll();
      const usersMap = {};
      for (const u of users) {
        usersMap[u.id] = { id: u.id, name: u.name, data: [] };
        for (let i = 0; i < months; i += 1) {
          usersMap[u.id].data.push([0, 0]);
        }
      }

      // Count win and lose
      for (const event of events) {
        const createdAtMonth = moment(event.createdAt).format('YYYY-MM');
        const index = labels.indexOf(createdAtMonth);
        for (const game of event.games) {
          for (const winner of game.winners) {
            usersMap[winner.player.user.id].data[index][0] += 1;
          }
          for (const loser of game.losers) {
            usersMap[loser.player.user.id].data[index][1] += 1;
          }
        }
      }

      ctx.body = {
        labels,
        users: _.sortBy(_.values(usersMap), (o) => o.name),
      };
    }),
  );
}

module.exports = init;
