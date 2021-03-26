import pino from 'pino';
import pinoLogger from 'express-pino-logger'


const logger = pino({
  timestamp: () => new Date().toISOString(),
  level: 'info',
  prettyPrint: { colorize: true },
});


export const expressLogger = pinoLogger({
  logger,
})

export default logger;
