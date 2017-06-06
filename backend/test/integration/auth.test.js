const fetch = require('isomorphic-fetch')
const Server = require('../../src')
const CONFIG = require('../config')
const cookie = require('../helpers/cookie')

const API_URL = `http://${CONFIG.host}:${CONFIG.port}/v1/api`

describe.skip('Auth', () => {
  let server
  beforeAll(async () => {
    server = new Server(CONFIG)
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
  })

  it('auth flow', async () => {
    const {
      YOYO_ADMIN_USERNAME,
      YOYO_ADMIN_PASSWORD,
    } = process.env
    const url = `${API_URL}/admin/login`
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: YOYO_ADMIN_USERNAME,
        password: YOYO_ADMIN_PASSWORD,
      }),
    }
    let error = null
    let header = null
    try {
      const resp = await fetch(url, opts)
      header = resp.headers
    } catch (e) {
      error = e
    }
    expect(error).toBe(null)
    const rawCookies = header.get('set-cookie')

    const { token, path, expires } = cookie(rawCookies)
    const keys = Object.keys(token)

    expect(keys.length).toBe(1)
    expect(keys[0]).toBe('YOYO_ADMIN_TOKEN')
    expect(token[keys[0]]).not.toBe(undefined)
    expect(path).toBe('/')

    const now = new Date()
    const expiresDate = new Date(expires)
    const deltaDays = Math.round((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    expect(deltaDays).toBe(30)

    const commentsUrl = `${API_URL}/admin/comments`
    let res
    try {
      res = await fetch(commentsUrl)
    } catch (e) {
      error = e
    }
    expect(res.status).toBe(401)
    expect(res.statusText).toBe('invalid token')
  })
})
