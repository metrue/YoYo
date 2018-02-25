// TODO
// this is a serious issue between /lib and /src (need to figrure out)
const Dal = require('../../src/dal')
const { mockComment } = require('../helpers/mock')
const Database = require('../helpers/db')

describe('Dal', () => {
  describe('Comments', () => {
    let dal = null
    let database = null

    const config = {
      host: 'localhost',
      port: 27017,
      db: 'YoYo-test',
    }

    beforeAll(async () => {
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
      expect(createdComment).toEqual(obj)
    })

    it('create with hooks', async () => {
      const comment = mockComment()
      const appendModFlag = (obj) => ({ ...obj, mod: true })
      const hooks = { preCreated: [appendModFlag] }
      await dal.create(comment, hooks)

      const ret = await database.collection.find(comment).toArray()
      // eslint-disable-next-line
      const { _id, ...createdComment } = ret[0]
      expect(createdComment).toEqual({ ...comment, mod: true })
    })

    it('find', async () => {
      const obj = mockComment()
      await database.collection.insert(obj)
      const ret = await dal.find(obj)
      expect(ret).toBeInstanceOf(Array)
      expect(ret.length === 1).toBe(true)
      expect(ret[0]).toEqual(obj)
    })

    afterAll(async () => {
      await database.collection.remove()
      await database.db.close()
    })
  })
})
