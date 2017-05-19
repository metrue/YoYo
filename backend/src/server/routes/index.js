import auth from '../auth'

const {
  YOYO_ADMIN_USERNAME,
  YOYO_ADMIN_PASSWORD,
} = process.env

export default [
  {
    path: '/health',
    method: 'GET',
    handler: async (ctx) => {
      ctx.body = 'OK'
    },
  },
  {
    path: '/comments',
    method: 'GET',
    handler: async (ctx, dal) => {
      const query = ctx.query
      const comments = await dal.find(query)
      ctx.body = comments
      // ctx.body = comments.map(c => ({ ...c, user: c.user.replace(/@.*$/, '') }))
    },
  },
  {
    path: '/comments',
    method: 'POST',
    handler: async (ctx, dal) => {
      const {
        user,
        uri,
        text,
        parents,
      } = ctx.request.body

      let error = null
      if (parents && parents.length > 0) {
        for (const parent of parents) {
          try {
            await dal.create({ user, uri, text, parent, date: (new Date()).toISOString() })
          } catch (e) {
            error = e
          }
        }
      } else {
        try {
          await dal.create({ user, uri, text, date: (new Date()).toISOString() })
        } catch (e) {
          error = e
        }
      }

      if (error === null) {
        ctx.status = 201
      } else {
        ctx.status = 500
        ctx.message = `comment created met some errors: ${error}`
      }
    },
  },
  {
    path: '/admin/login',
    method: 'POST',
    handler: async (ctx) => {
      const { username, password } = ctx.request.body
      if (username === YOYO_ADMIN_USERNAME && password === YOYO_ADMIN_PASSWORD) {
        const token = auth.sign(username, password)
        ctx.body = { token }
      } else {
        ctx.status = 401
        ctx.message = 'invalid username or password'
      }
    },
  },
  {
    path: '/admin/comments',
    method: 'GET',
    handler: async (ctx, dal) => {
      const query = ctx.query
      const comments = await dal.queryWithUri(query)
      ctx.body = comments
    },
  },
  {
    path: '/admin/comments/:id',
    method: 'DELETE',
    handler: async (ctx, dal) => {
      const id = ctx.params.id
      await dal.deleteOne(id)
      ctx.status = 204
    },
  },
]
