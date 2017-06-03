import { expect } from 'chai'
import fetch from 'isomorphic-fetch'
import Server from '../../src/server'
import CONFIG from '../config'
import { cookie } from '../helpers/cookie'

const API_URL = `http://${CONFIG.host}:${CONFIG.port}/v1/api`

describe('Auth', () => {
  let server
  before(async () => {
    server = new Server(CONFIG)
    await server.start()
  })

  after(() => {
    server.stop()
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
    const rawCookies = header.get('set-cookie')
    const { token, path, expires } = cookie(rawCookies)
    const keys = Object.keys(token)
    expect(error).to.equal(null)
    expect(keys.length).to.equal(1)
    expect(keys[0]).to.equal('YOYO_ADMIN_TOKEN')
    expect(token[keys[0]]).to.not.equal(undefined)
    expect(path).to.equal('/')

    const now = new Date()
    const expiresDate = new Date(expires)
    const deltaDays = Math.round((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    expect(deltaDays).to.equal(30)

    const commentsUrl = `${API_URL}/admin/comments`
    let res
    try {
      res = await fetch(commentsUrl)
    } catch (e) {
      error = e
    }
    expect(res.status).to.equal(401)
    expect(res.statusText).to.equal('invalid token')
  })
})
