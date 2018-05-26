const handler = require('../handler')

describe('users', () => {
  let createdComment
  const user = {
    user: 'a@a.com',
    uri: 'http://a.com',
    text: 'hello world'
  }
  test('create', (done) => {
    handler.create({ body: JSON.stringify(user) }, null, (err, resp) => {
      expect(err).toBeNull()
      createdComment = JSON.parse(resp.body)
      expect(createdComment.user).toEqual(user.user)
      expect(createdComment.uri).toEqual(user.uri)
      expect(createdComment.text).toEqual(user.text)
      done()
    })
  })

  test('list', (done) => {
    handler.list(null, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.length >= 1).toBeTruthy()
      done()
    })
  })

  test('get', (done) => {
    handler.get({
      pathParameters: {
        id: createdComment.id,
      }
    }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.user).toEqual(user.user)
      expect(data.text).toEqual(user.text)
      expect(data.uri).toEqual(user.uri)
      done()
    })
  })

  test('update text', (done) => {
    const body = {
      text: 'change_to_this',
    }
    handler.update({
      pathParameters: {
        id:  createdComment.id
      },
      body: JSON.stringify(body)
    }, null, (err, resp) => {
      expect(err).toBeNull()
      handler.get({
        pathParameters: {
          id: createdComment.id
        }
      }, null, (err, resp) => {
        const data = JSON.parse(resp.body)
        expect(data.text).toEqual(body.text)
        done()
      })
    })
  })
})
