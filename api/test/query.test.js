const handler = require('../handler')
const { create, query } = handler

describe('query', () => {
  const uri = 'http://example.com'

  beforeAll((done) => {
    const comments = [0, 1, 2, 3].map((id) => {
      return {
        uri,
        email: `${id}@a.com`,
        text: `hello world from ${0}`,
        parents: [],
      }
    })
    const reqs = comments.map((c) => {
      return new Promise((res) => {
        create({ body: JSON.stringify(c) }, null, (err, resp) => res(err))
      })
    })
    Promise.all(reqs).then(vals => done()).catch(e => console.error(e))
  })

  test('query', (done) => {
    handler.query({ queryStringParameters: { uri } }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      // TODO clean up first
      expect(data.length >= 4).toEqual(true)
      expect(data.every(d => d.uri === uri.replace('http://', ''))).toEqual(true)
      let dec = true
      for (let i = 1; i < data.length; i++) {
        pre = data[i - 1]
        cur = data[i]
        if (cur.updatedAt > pre.updatedAt) {
          dec = false
          break
        }
      }
      expect(dec).toEqual(true)
      done()
    })
  })
})
