import { expect } from 'chai'
import fetch from 'isomorphic-fetch'
import Server from '../../src/server'
import CONFIG from '../config'

const API_URL = `http://${CONFIG.host}:${CONFIG.port}/v1/api`

describe.only('Auth', () => {
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
    let token = null
    try {
      const resp = await fetch(url, opts)
      const data = await resp.json()
      token = data.token
    } catch (e) {
      console.warn(e)
      error = e
    }
    expect(error).to.equal(null)
    expect(token).to.not.equal(null)

    const commentsUrl = `${API_URL}/admin/comments`
    let res
    try {
      res = await fetch(commentsUrl)
    } catch (e) {
      error = e
    }
    expect(res.status).to.equal(401)
    expect(res.statusText).to.equal('invalid token')

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      res = await fetch(commentsUrl, options)
    } catch (e) {
      error = e
    }
    expect(res.status).to.equal(200)
    const data = await res.json()
    expect(Array.isArray(data)).to.equal(true)
  })
})
