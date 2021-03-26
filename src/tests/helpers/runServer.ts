import { createServer } from 'http'
import app from '../..'

const httpServer = createServer(app)

export default httpServer