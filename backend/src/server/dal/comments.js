import { ObjectID } from 'mongodb'
import BaseDal from './base_dal'
import { withMailer } from './utils'

@withMailer
export default class Comments extends BaseDal {
  async create(obj) {
    const { parent, text } = obj
    // eslint-disable-next-line
    const item = await this.findOne({ _id: ObjectID(parent) })
    if (item && item.user) {
      await this.mailer.send(item.user, text)
    }

    return super.create(obj)
  }
}
