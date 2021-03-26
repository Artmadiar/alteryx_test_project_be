import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'

import config from './config'
import logger, { expressLogger } from './lib/logger'
import router from './router'


const app = express()
const httpServer = createServer(app)

if (config.server.cors.enable) {
  app.use(cors())
}
app.use(expressLogger)

app.use(cookieParser())

app.use(compression())

app.use(router)

httpServer.listen(config.server.port, () => {
  logger.info(`Server is running on ${config.server.port} port`);
});
