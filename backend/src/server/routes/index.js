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
      if (parents && parents.length > 0) {
        parents.forEach(async (parent) => {
          await dal.create({ user, uri, text, parent, date: (new Date()).toISOString() })
        })
      } else {
        await dal.create({ user, uri, text, date: (new Date()).toISOString() })
      }
      ctx.status = 201
    },
  },
]
