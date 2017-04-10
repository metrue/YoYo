import mongo from './db'

export default class Dal {
  constructor(config) {
    this.mongo = mongo
    this.config = config
  }

  async collection(name) {
    if (this.mongo.db === null) {
      await this.mongo.connect(this.config)
    }
    return await this.mongo.db.collection(name)
  }

  async save(collectionName, obj) {
    const col = await this.collection(collectionName)
    return await col.insert(obj)
  }

  async find(collectionName, query = {}) {
    const col = await this.collection(collectionName)
    return await col.find(query).toArray()
  }
}
