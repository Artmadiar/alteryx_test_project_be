import fetch, { RequestInit } from 'node-fetch'
import config from '../../config'
import logger from '../../lib/logger'


export default (path: string, opts?: RequestInit) => {
  const url = `http://${config.server.hostname}:${config.server.port}${path}`

  return fetch(url, opts)
    .then(res => res.json())
}
