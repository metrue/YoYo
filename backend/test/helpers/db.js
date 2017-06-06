const MongoClient = require('mongodb').MongoClient

class Database {
  constructor() {
    this.db = null
    this.collection = null
  }

  async init(options) {
    if (this.db === null) {
      const { host, port, db } = options
      this.db = await MongoClient.connect(`mongodb://${host}:${port}/${db}`)
    }

    const { collection } = options
    if (this.collection === null) {
      this.collection = await this.db.collection(collection)
    }
  }
}

module.exports = Database
