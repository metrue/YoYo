import { MongoClient } from 'mongodb'

class Mongo {
  constructor() {
    this.db = null
  }

  async connect(opts) {
    const url = `mongodb://${opts.host}:${opts.port}/${opts.db}`
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, db) => {
        if (err) {
          reject(err)
        } else {
          this.db = db
          resolve(db)
        }
      })
    })
  }

  isConnected() {
    return this.db !== null
  }

  async collection(name) {
    return await this.db.collection(name)
  }

  async close() {
    await this.db.close()
    this.db = null
  }

  async _dropDB() {
    await this.db.dropDatabase()
  }
}

export default new Mongo()
