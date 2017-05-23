import Koa from 'koa'
import serve from 'koa-static'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import logger from 'koa-logger'
import cors from 'koa-cors'
import path from 'path'

import routes from './routes'
import auth from './auth'
import Dal from './dal'
import { getToken } from './token'

import CONFIG from '../../config.json'

const updateOriginMiddleware = async (ctx, next) => {
  const allowedOrigins = ['https://admin.yiqie.me', 'https://client.yiqie.me']
  const origin = ctx.request.headers.origin
  if (allowedOrigins.indexOf(origin) > -1) {
    ctx.response.set('Access-Control-Allow-Origin', origin)
  }
  await next()
}

const authMiddleware = async (ctx, next) => {
  const req = ctx.request
  const shouldAuth = req.url.startsWith('/v1/api/admin') &&
                     req.url !== '/v1/api/admin/login'
  if (shouldAuth) {
    const token = getToken(ctx)
    try {
      auth.verify(token)
    } catch (e) {
      ctx.status = 401
      ctx.message = 'invalid token'
      return
    }
  }
  await next()
}

export default class {
  constructor(opts = CONFIG) {
    this.host = opts.host || 'localhost'
    this.port = opts.port || 5000

    this.dals = new Dal(opts.mongo)

    this.app = new Koa()
    this.enableCORS()
    this.app.use(compress())
    this.app.use(logger())
    this.app.use(bodyParser())
    this.app.use(authMiddleware)
    this.app.use(updateOriginMiddleware)

    this.setupHandlers(opts)

    this.serveYo()
  }

  serveYo() {
    const YoPath = path.join(__dirname, '../../')
    this.app.use(serve(YoPath))
  }

  setupHandlers() {
    const router = new Router({ prefix: '/v1/api' })

    routes.forEach((route) => {
      const handler = async (ctx) => {
        if (route.path && route.path.startsWith('/comments')) {
          await route.handler(ctx, this.dals.comments)
        } else if (route.path && route.path.startsWith('/admin')) {
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
      credentials: true,
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
    await this._server.close()
  }
}
