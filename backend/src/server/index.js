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

    this.app = new Koa()
    this.dal = new Dal(opts.mongo)

    this.enableCORS()
    this.app.use(compress())
    this.app.use(logger())
    this.app.use(bodyParser())
    this.app.use(koajwt({ secret: opts.jwt.secret }).unless(this.isPublic))

    this.setupHandlers()
    this.serveYo()
  }

  isPublic(ctx) {
    return true

    const request = ctx.request
    if (request.method === 'GET') {
      if (request.url.match(/\/jira\//)) {
        return false
      }
      return true
    }

    if (request.method === 'POST') {
      if (request.url.match(/\/login$/) ||
          request.url.match(/\/reports$/)) {
        return true
      }
      return false
    }

    return false
  }

  serveYo() {
    const YoPath = path.join(__dirname, '../../')
    this.app.use(serve(YoPath))
  }

  setupHandlers() {
    const router = new Router({ prefix: '/v1/api' })

    routes.forEach((route) => {
      const handler = async (ctx) => {
        await route.handler(ctx, this.dal)
      }

      if (route.method === 'POST') {
        router.post(route.path, handler)
      } else if (route.method === 'PUT') {
        router.put(route.path, handler)
      } else if (route.method === 'DELETE') {
        router.del(route.path, handler)
      } else {
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
