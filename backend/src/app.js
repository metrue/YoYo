import 'babel-polyfill'
import Server from './server'
import CONFIG from '../config.json'

(async () => {
  try {
    const server = new Server(CONFIG)
    await server.start()
  } catch (e) {
    console.log(e.stack)
  }
})()
