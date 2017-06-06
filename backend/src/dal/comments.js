const { ObjectID } = require('mongodb')
const BaseDal = require('./base_dal')

class Comments extends BaseDal {
  async create(obj, hooks = {}) {
    const preCreate = hooks.preCreate || []
    const postCreated = hooks.postCreated || []

    let comment = { ...obj }
    for (const prehook of preCreate) {
      if (typeof prehook === 'function') {
        comment = await prehook(comment)
      }
    }

    const col = await this.collection()
    await col.insert(comment)

    for (const posthook of postCreated) {
      if (typeof postCreated === 'function') {
        const { parent } = comment
        // eslint-disable-next-line
        const item = await this.findOne({ _id: ObjectID(parent) })
        await posthook(comment, item)
      }
    }
  }

  async queryWithUri(q = {}) {
    const page = parseInt(q.page, 10) || 0
    const limit = parseInt(q.limit, 10) || 100
    const skip = page * limit

    const col = await this.collection()
    return col.find({ uri: { $regex: `${q.uri}` } })
              .skip(skip)
              .limit(limit)
              .toArray()
  }
}

module.exports = Comments
