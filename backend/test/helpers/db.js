const MongoClient = require('mongodb').MongoClient

const DB = {
  db: null,
}

const getDatabase = async (options) => {
  const { host, port, db } = options
  if (DB.db === null) {
    DB.db = await MongoClient.connect(`mongodb://${host}:${port}/${db}`)
  }
  return DB.db
}

const getCollection = async (options) => {
  const { host, port, db, collection } = options
  if (DB.db === null) {
    DB.db = await MongoClient.connect(`mongodb://${host}:${port}/${db}`)
  }
  const col = await DB.db.collection(collection)
  return col
}

module.exports = {
  collection: (options) => getCollection(options),
  db: (options) => getDatabase(options),
}
