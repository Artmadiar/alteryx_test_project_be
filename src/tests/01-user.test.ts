import prepareDatabase from './helpers/prepareDatabase'
import server from './helpers/runServer'
import fetch from './helpers/fetch'
import config from '../config'
import logger from '../lib/logger'


beforeAll(async () => {
  jest.setTimeout(30000)

  await prepareDatabase()

  server.listen(config.server.port, () => {
    logger.info(`Express server is listening on port: ${config.server.port}`)
  })
})


afterAll((done) => {
	server.close(done)
})


describe('user crud operations', () => {
  test('get users', async () => {
    const users = await fetch('/user')
    expect(users).toEqual([])
  })
})
