const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((opts) => `[${opts.moduleName}] ${opts.level}: ${opts.message}`),
      ),
    }),
  ],
});

module.exports = logger.child({ moduleName: process.env.SERVICE_NAME });
