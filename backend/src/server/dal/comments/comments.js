import Dal from '../dal'

const COLLECTION_NAME = 'Comments'

export default class Comment {
  constructor(config) {
    this.dal = new Dal(config)
  }

  async create(comment) {
    return await this.dal.save(COLLECTION_NAME, comment)
  }

  async find(query = {}) {
    const comments = await this.dal.find(COLLECTION_NAME, query)
    return comments.map(c => (
      {
        user: c.user,
        uri: c.uri,
        text: c.text,
        id: c._id,
        date: c.date,
      }
    ))
  }
}
