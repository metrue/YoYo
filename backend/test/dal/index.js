import Dal from '../../lib/server/dal'
import { expect } from 'chai'
import { mockAComment } from '../utils'
import database from '../helpers/db'

describe.only('Dal', () => {
  describe('Comments', () => {
    let dal = null
    let commentsCol = null

    const config = {
      host: 'localhost',
      port: 27017,
      db: 'YoYo-test',
    }

    before(async () => {
      dal = (new Dal(config)).comments
      commentsCol = await database.collection({
        ...config,
        collection: 'Comments',
      })
    })

    it('create', async () => {
      const obj = mockAComment()
      await dal.create({ ...obj })

      const ret = await commentsCol.find(obj).toArray()
      // eslint-disable-next-line
      const { _id, ...createdComment } = ret[0]
      expect(createdComment).to.eql(obj)
    })

    it('create with preProcess', async () => {
      const comment = mockAComment()
      const preProcess = (obj) => ({ ...obj, mod: true })
      await dal.create(comment, preProcess)

      const ret = await commentsCol.find(comment).toArray()
      // eslint-disable-next-line
      const { _id, ...createdComment } = ret[0]
      expect(createdComment).to.eql({ ...comment, mod: true })
    })

    it('find', async () => {
      const obj = mockAComment()
      await commentsCol.insert(obj)
      const ret = await dal.find(obj)
      expect(ret).to.be.an.instanceof(Array)
      expect(ret.length === 1).to.equal(true)
      expect(ret[0]).to.eql(obj)
    })

    after(async () => {
      const db = await database.db(config)
      await commentsCol.remove()
      await db.close()
    })
  })
})
