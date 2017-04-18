import mongo from './db'

export default class Dal {
  constructor(config) {
    if (!config.host ||
      !config.port ||
      !config.db ||
      !config.collectionName) {
      throw new Error('host, port, db, and collection name are required')
    }

    this.config = config
    this.collectionName = config.collectionName
  }

  async collection() {
    if (!mongo.isConnected()) {
      await mongo.connect(this.config)
    }
    return await mongo.collection(this.collectionName)
  }

  async create(obj) {
    const col = await this.collection(this.collectionName)
    return await col.insert(obj)
  }

  async find(query = {}) {
    const col = await this.collection(this.collectionName)
    return await col.find(query).toArray()
  }
}
