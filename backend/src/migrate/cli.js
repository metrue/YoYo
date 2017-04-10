import program from 'commander'

import Migration from './migration'

program
  .version('0.0.1')
  .option('-e, --env [env]', 'dev,test')
  .option('-h, --host [host]', 'host')
  .option('-p, --port [port]', 'port')
  .option('-n, --database [name]', 'database name')
  .option('-u, --up', 'up')
  .option('-d, --down', 'down')
  .parse(process.argv);

(async () => {
  const env = program.env || 'dev'
  const db = program.db || `appinspector-${env}`
  const host = program.host || '127.0.0.1'
  const port = program.port || 27017
  const config = {
    env,
    host,
    port,
    db,
    collections: {
      appinspect: 'appinspect',
      policy: 'policy',
      vetting: 'vetting',
    },
  }

  const migration = new Migration(config)
  if (program.up) {
    try {
      await migration.up()
      console.log('migration done OK')
    } catch (e) {
      console.warn(e)
    }
  } else if (program.down) {
    try {
      await migration.down()
      console.log('migration done OK')
    } catch (e) {
      console.warn(e)
    }
  }
})()
