const Koa = require('koa')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const logger = require('koa-logger')
const cors = require('koa-cors')
const serve = require('koa-static')

const routes = require('./routes')
const auth = require('./auth')
const hooks = require('./hooks')
const Dal = require('./dal')
const { getToken } = require('./token')

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

class Server {
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

    // TODO testing on this
    const staticRoot = `${__dirname}/../public`
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

module.exports = Server
