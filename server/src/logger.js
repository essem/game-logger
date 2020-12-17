const winston = require('winston');
const config = require('config');

const logger = winston.createLogger();

const logConfig = config.get('log');
if (logConfig) {
  logger.add(
    new winston.transports.Console({
      ...logConfig,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}

module.exports = logger;
