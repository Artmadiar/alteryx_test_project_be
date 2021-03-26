import { exec } from 'child_process'
import logger from '../../lib/logger'


function run(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  });
}

export default async function initServer() {
  try {
    logger.info('recreating the database...');
    await run('NODE_ENV=test npm run db:drop');
    await run('NODE_ENV=test npm run db:create');
    logger.info('Done');

    logger.info('migrating the schema...');
    await run('NODE_ENV=test npm run db:migrate');

    logger.info('Done.');
  } catch (err) {
    throw err;
  }
}
