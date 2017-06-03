import mongo from './db'
import { ObjectID } from 'mongodb'

function buidQuery(query = {}) {
  const allowedFields = ['_id', 'user', 'uri', 'text', 'date', 'parent']
  const newQuery = {}
  for (const f of allowedFields) {
    if (allowedFields.indexOf(f) !== -1 && query[f] !== undefined) {
      newQuery[f] = query[f]
    }
  }
  return newQuery
}

export default class BaseDal {
  constructor(config) {
    const { host, port, db, collectionName } = config
    const goodToGo = host && port && db && collectionName
    if (!goodToGo) {
      throw new Error('host, port, db, and collection name are required')
    }

    this.url = `mongodb://${host}:${port}/${db}`
    this.collectionName = collectionName
  }

  async collection() {
    if (!mongo.isConnected()) {
      await mongo.connect(this.url)
    }
    return await mongo.collection(this.collectionName)
  }

  async create(obj) {
    const col = await this.collection()
    // TODO figure out why create insert operation modifies the origin obj
    return await col.insert(obj)
  }

  async deleteOne(id) {
    const col = await this.collection()
    // eslint-disable-next-line
    return await col.deleteOne({ _id: ObjectID(id) })
  }

  async deleteMany(filter) {
    const col = await this.collection()
    return await col.deleteMany(filter)
  }

  async deleteAll() {
    return await this.deleteMany({})
  }

  async findOne(query) {
    const col = await this.collection()
    return col.findOne(buidQuery(query))
  }

  async find(query = {}) {
    const page = parseInt(query.page, 10) || 0
    const limit = parseInt(query.limit, 10) || 100
    const skip = page * limit
    const col = await this.collection()
    return col.find(buidQuery(query))
              .skip(skip)
              .limit(limit)
              .toArray()
  }
}
