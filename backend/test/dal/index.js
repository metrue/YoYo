import Dal from '../../lib/server/dal'
import { expect } from 'chai'
import { mockComment } from '../helpers/mock'
import Database from '../helpers/db'

describe('Dal', () => {
  describe('Comments', () => {
    let dal = null
    let database = null

    const config = {
      host: 'localhost',
      port: 27017,
      db: 'YoYo-test',
    }

    before(async () => {
      dal = (new Dal(config)).comments
      database = new Database()
      await database.init({
        ...config,
        collection: 'Comments',
      })
    })

    it('create', async () => {
      const obj = mockComment()
      await dal.create({ ...obj })

      const ret = await database.collection.find(obj).toArray()
      // eslint-disable-next-line
      const { _id, ...createdComment } = ret[0]
      expect(createdComment).to.eql(obj)
    })

    it('create with hooks', async () => {
      const comment = mockComment()
      const appendModFlag = (obj) => ({ ...obj, mod: true })
      const hooks = { preCreate: [appendModFlag] }
      await dal.create(comment, hooks)

      const ret = await database.collection.find(comment).toArray()
      // eslint-disable-next-line
      const { _id, ...createdComment } = ret[0]
      expect(createdComment).to.eql({ ...comment, mod: true })
    })

    it('find', async () => {
      const obj = mockComment()
      await database.collection.insert(obj)
      const ret = await dal.find(obj)
      expect(ret).to.be.an.instanceof(Array)
      expect(ret.length === 1).to.equal(true)
      expect(ret[0]).to.eql(obj)
    })

    after(async () => {
      await database.collection.remove()
      await database.db.close()
    })
  })
})
