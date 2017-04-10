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
      const comments = await dal.comments.find(query)
      ctx.body = comments
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
      const ret = await dal.comments.create({
        user,
        uri,
        text,
        date: (new Date()).toISOString(),
      })
      ctx.body = ret
    },
  },
]
