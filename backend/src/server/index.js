import Koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import logger from 'koa-logger'
import cors from 'koa-cors'
import serve from 'koa-static'

import routes from './routes'
import auth from './auth'
import hooks from './hooks'
import Dal from './dal'
import { getToken } from './token'

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
  constructor(config) {
    this.config = config

    this.host = config.host || 'localhost'
    this.port = config.port || 5000

    this.dals = new Dal(config.mongo)
    this.hooks = hooks(config)

    this.app = new Koa()
    this.enableCORS()
    this.app.use(authMiddleware)
    this.app.use(compress())
    this.app.use(logger())
    this.app.use(bodyParser())

    this.setupHandlers(config)

    const staticRoot = `${__dirname}/../../public`
    this.app.use(serve(staticRoot))
  }

  setupHandlers() {
    const router = new Router({ prefix: '/v1/api' })

    routes.forEach((route) => {
      const handler = async (ctx) => {
        if (route.path && route.path.startsWith('/comments')) {
          await route.handler(ctx, this.dals.comments, this.hooks)
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
      origin: (ctx) => {
        const origin = ctx.headers.origin
        //
        // if request with credentials, origin cannot be '*',
        // origin should be exactly the request origin
        //
        if (this.config.origins.indexOf(origin) > -1) {
          return origin
        }
        return '*'
      },
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
