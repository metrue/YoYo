import { expect } from 'chai'
import CONFIG from '../config'
import fetch from 'isomorphic-fetch'
import Server from '../../src/server'
import { mockComment } from '../helpers/mock'
import Database from '../helpers/db'

const API_URL = `http://${CONFIG.host}:${CONFIG.port}/v1/api`

describe('API', () => {
  let server
  before(async () => {
    server = new Server(CONFIG)
    await server.start()
  })

  after(() => {
    server.stop()
  })

  describe('Comments', async () => {
    let database = null

    before(async () => {
      database = new Database()
      await database.init({
        ...CONFIG.mongo,
        collection: 'Comments',
      })

      await database.collection.remove()
    })

    after(async () => {
      await database.collection.remove()
      await database.db.close()
    })

    it('create a normal comment', async () => {
      const comment = mockComment()
      const url = `${API_URL}/comments`
      const opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      }
      let error = null
      let resp = null
      try {
        resp = await fetch(url, opts)
      } catch (e) {
        error = e
      }
      expect(error).to.equal(null)
      expect(resp.status).to.equal(201)

      const ret = await database.collection.find(comment).toArray()
      expect(ret.length).to.equal(1)
      // eslint-disable-next-line
      const { _id, date, ...createdComment } = ret[0]
      expect(createdComment).to.eql({ ...comment, mod: false })
    })

    it('create a mod comment', async () => {
      const comment = mockComment()
      const modComment = { ...comment, user: CONFIG.adminEmail }
      const url = `${API_URL}/comments`
      const opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(modComment),
      }
      let error = null
      let resp = null
      try {
        resp = await fetch(url, opts)
      } catch (e) {
        error = e
      }
      expect(error).to.equal(null)
      expect(resp.status).to.equal(201)

      const ret = await database.collection.find(modComment).toArray()
      expect(ret.length).to.equal(1)
      // eslint-disable-next-line
      const { _id, date, ...createdComment } = ret[0]
      expect(createdComment).to.eql({ ...modComment, mod: true })
    })

    it('list all comments', async () => {
      const url = `${API_URL}/comments`
      let error = null
      let data = null
      try {
        const resp = await fetch(url)
        data = await resp.json()
      } catch (e) {
        error = e
      }
      expect(error).to.equal(null)
      expect(data).to.an.instanceof(Array)
      expect(data.length > 0).to.equal(true)
    })

    it('list by page', async () => {
      const url = `${API_URL}/comments?page=0&limit=2`
      let error = null
      let data = null
      try {
        const resp = await fetch(url)
        data = await resp.json()
      } catch (e) {
        error = e
      }
      expect(error).to.equal(null)
      expect(data).to.an.instanceof(Array)
      expect(data.length).to.equal(2)
    })
  })
})
