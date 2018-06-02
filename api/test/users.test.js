const handler = require('../handler')

describe('users', () => {
  let createdComment
  const user = {
    email: 'b@b.com',
    uri: 'http://a.com',
    text: 'hello world',
    parents: [ 'h.minghe@gmail.com' ],
  }

  describe('create', () => {
    test('create - user', (done) => {
      handler.create({ body: JSON.stringify(user) }, null, (err, resp) => {
        expect(err).toBeNull()
        createdComment = JSON.parse(resp.body)
        expect(createdComment.email).toEqual(user.email)
        expect(createdComment.uri).toEqual(user.uri)
        expect(createdComment.text).toEqual(user.text)
        expect(createdComment.mod).toEqual(false)
        done()
      })
    })

    test('create - mod', (done) => {
      // TODO mod@mod.com is configured in test.config.js
      // that means every comment with email equals to 'mod@mod.com
      // is from moderator
      const modComment = {
        email: 'mod@mod.com',
        uri: 'http://b.com',
        text: 'hello world',
        parents: [ 'h.minghe@gmail.com' ],
      }
      handler.create({ body: JSON.stringify(modComment) }, null, (err, resp) => {
        expect(err).toBeNull()
        createdModComment = JSON.parse(resp.body)
        expect(createdModComment.email).toEqual(modComment.email)
        expect(createdModComment.uri).toEqual(modComment.uri)
        expect(createdModComment.text).toEqual(modComment.text)
        expect(createdModComment.mod).toEqual(true)
        done()
      })
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
      expect(data.email).toEqual(user.email)
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

  test('query', (done) => {
    handler.query({
      queryStringParameters: {
        uri: createdComment.uri
      },
    }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data[0].uri).toEqual(user.uri)
      expect(data[0].mod).toEqual(false)
      done()
    })
  })
})
