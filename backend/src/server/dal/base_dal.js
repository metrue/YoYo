import mongo from './db'

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
    return await col.insert(obj)
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
