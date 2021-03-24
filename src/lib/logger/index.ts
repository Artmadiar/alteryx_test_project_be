import pino from 'pino';

const logger = pino({
  timestamp: () => new Date().toISOString(),
  level: 'info',
  prettyPrint: { colorize: true },
});

export default logger;
