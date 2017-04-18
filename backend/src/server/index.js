import Koa from 'koa'
import serve from 'koa-static'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import logger from 'koa-logger'
import cors from 'koa-cors'
import koajwt from 'koa-jwt'
import path from 'path'

import routes from './routes'
import Dal from './dal'

import CONFIG from '../../config.json'

export default class {
  constructor(opts = CONFIG) {
    this.host = opts.host || 'localhost'
    this.port = opts.port || 5000

    this.dals = this.createDals(opts.mongo)

    this.app = new Koa()
    this.enableCORS()
    this.app.use(compress())
    this.app.use(logger())
    this.app.use(bodyParser())

    this.setupHandlers(opts)
    this.serveYo()
  }

  serveYo() {
    const YoPath = path.join(__dirname, '../../')
    this.app.use(serve(YoPath))
  }

  createDals(options) {
    return {
      comments: new Dal({ ...options, collectionName: 'Comments' }),
    }
  }

  setupHandlers() {
    const router = new Router({ prefix: '/v1/api' })


    routes.forEach((route) => {
      const handler = async (ctx) => {
        if (route.path && route.path.startsWith('/comments')) {
          await route.handler(ctx, this.dals.comments)
        }
      }

      switch (route.method) {
        case 'POST':
          router.post(route.path, handler)
          break
        case 'PUT':
          router.put(route.path, handler)
          break
        case 'DELETE':
          router.del(route.path, handler)
          break

        default:
          router.get(route.path, handler)
      }
    })

    this.app
      .use(router.routes())
      .use(router.allowedMethods())
  }

  enableCORS() {
    const options = {
      origin: '*',
    }
    this.app.use(cors(options))
  }

  async start() {
    try {
      this._server = await this.app.listen(this.port)
    } catch (e) {
      console.warn(e.stack)
    }
  }

  async stop() {
    // try {
    //   await this.dal.comments.dal.mongo.close()
    // } catch (e) {
    //   console.warn(e.stack)
    // }
    await this._server.close()
  }
}
