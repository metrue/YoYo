import 'babel-polyfill'
import Server from './server'

(async () => {
  try {
    const server = new Server()
    await server.start()
  } catch (e) {
    console.log(e.stack)
  }
})()
