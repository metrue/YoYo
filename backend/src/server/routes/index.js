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
      ctx.body = comments.map(c => ({ ...c, user: c.user.replace(/@.*$/, '') }))
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
      } = ctx.request.body
      const ret = await dal.create({
        user,
        uri,
        text,
        date: (new Date()).toISOString(),
      })
      ctx.body = ret
    },
  },
]
