import Dal from '../../lib/server/dal'
import { expect } from 'chai'
import { mockAComment } from '../utils'

describe('Dal', () => {
  describe('Comments', () => {
    let dal = null
    before(() => {
      const config = {
        host: 'localhost',
        port: 27017,
        db: 'YoYo-dev',
      }
      dal = (new Dal(config)).comments
    })

    it('create and find', async () => {
      const obj = mockAComment()
      await dal.create(obj)
      const ret = await dal.find({})

      expect(ret).to.be.an.instanceof(Array)
      expect(ret.length >= 1).to.equal(true)
      const createdComment = ret[ret.length - 1]
      expect(createdComment.user).to.eql(obj.user)
      expect(createdComment.uri).to.eql(obj.uri)
      expect(createdComment.text).to.eql(obj.text)
    })
  })
})
