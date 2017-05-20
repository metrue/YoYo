import { ObjectID } from 'mongodb'
import BaseDal from './base_dal'
import { withMailer } from './utils'

@withMailer
export default class Comments extends BaseDal {
  async create(obj) {
    await super.create(obj)

    const { parent, text, uri } = obj
    // eslint-disable-next-line
    const item = await this.findOne({ _id: ObjectID(parent) })
    if (item && item.user) {
      const appedUriText = `${text} - ${uri}`
      await this.mailer.send(item.user, appedUriText)
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
