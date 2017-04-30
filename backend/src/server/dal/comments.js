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
}
