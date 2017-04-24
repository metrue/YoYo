import { expect } from 'chai'
import CONFIG from '../config'
import fetch from 'isomorphic-fetch'
import Server from '../../src/server'
import { mockAComment } from '../utils'

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
    describe('Create', () => {
      it('create a comment', async () => {
        const comment = mockAComment()
        const url = `${API_URL}/comments`
        const opts = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(comment),
        }
        let error = null
        let data = null
        try {
          const resp = await fetch(url, opts)
          data = await resp.json()
        } catch (e) {
          error = e
        }
        expect(error).to.equal(null)
        const createdComment = data.ops[0]
        expect(createdComment.uri).to.equal(comment.uri)
        expect(createdComment.user).to.equal(comment.user)
        expect(createdComment.text).to.equal(comment.text)
      })
    })

    describe('List', () => {
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
})
