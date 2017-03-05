const route = require('koa-route');
const config = require('config');
const jwt = require('jsonwebtoken');
const models = require('./models');

async function authenticate(account, password) {
  const user = await models.user.findOne({
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
  app.use(async (ctx, next) => {
    const token = ctx.headers['x-access-token'];
    if (token) {
      try {
        const decoded = jwt.verify(token, config.auth.secret);
        ctx.app.context.account = decoded.account;
        ctx.app.context.admin = decoded.admin;
      } catch (err) {} // eslint-disable-line no-empty
    }
    await next();
  });

  app.use(route.post('/api/login', async (ctx) => {
    const req = ctx.request.body;
    const user = await authenticate(req.account, req.password);
    if (!user) {
      ctx.body = JSON.stringify({
        token: null,
      });
      return;
    }

    const info = { account: user.name, admin: user.admin };
    const token = jwt.sign(info, config.auth.secret, {
      expiresIn: '24h',
    });

    ctx.body = JSON.stringify({
      token,
    });
  }));
}

module.exports = init;
