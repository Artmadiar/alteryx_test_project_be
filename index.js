global.Promise = require('bluebird');
require('dotenv').config();

let appPath = './build';

if (['production', 'staging'].indexOf(process.env.NODE_ENV) === -1) {
  appPath = './src';

  global.Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: false,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: false
  });

  require('@babel/register');
}


const app = require(appPath).default;
const server = require('http').Server(app);

const config = require(`${appPath}/config`).default;
const logger = require(`${appPath}/lib/logger`).default;

server.listen(config.server.port, (error) => {
  if (error) {
    logger.error('Unable to listen for connections', error);
    process.exit(10);
  }
  logger.info(`Express server is listening on port: ${config.server.port}`);
});
