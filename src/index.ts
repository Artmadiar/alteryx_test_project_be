import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'

import config from './config'
import { expressLogger } from './lib/logger'
import router from './router'


const app = express()

if (config.server.cors.enable) {
  app.use(cors())
}
app.use(expressLogger)

app.use(cookieParser())

app.use(compression())

app.use(router)

export default app
