import CONFIG from '../config'
import fetch from 'isomorphic-fetch'
import Server from '../../src/server'
import { mockComment } from '../helpers/mock'
import Database from '../helpers/db'

const API_URL = `http://${CONFIG.host}:${CONFIG.port}/v1/api`

describe('API - Comments', async () => {
  let database = null
  let server

  beforeAll(async () => {
    server = new Server(CONFIG)
    await server.start()

    database = new Database()
    await database.init({
      ...CONFIG.mongo,
      collection: 'Comments',
    })

    await database.collection.remove()
  })

  afterAll(async () => {
    await database.collection.remove()
    await database.db.close()

    server.stop()
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
    expect(error).toBe(null)
    expect(resp.status).toBe(201)

    const ret = await database.collection.find(comment).toArray()
    expect(ret.length).toBe(1)
    // eslint-disable-next-line
    const { _id, date, ...createdComment } = ret[0]
    expect(createdComment).toEqual({ ...comment, mod: false })
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
    expect(error).toBe(null)
    expect(resp.status).toBe(201)

    const ret = await database.collection.find(modComment).toArray()
    expect(ret.length).toBe(1)
    // eslint-disable-next-line
    const { _id, date, ...createdComment } = ret[0]
    expect(createdComment).toEqual({ ...modComment, mod: true })
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
    expect(error).toBe(null)
    expect(data).toBeInstanceOf(Array)
    expect(data.length > 0).toBe(true)
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
    expect(error).toBe(null)
    expect(data).toBeInstanceOf(Array)
    expect(data.length).toBe(2)
  })
})
