import Dal from '../../lib/server/dal/dal'
import { expect } from 'chai'
import { mockAComment } from '../utils'

describe('Dal', () => {
  let commentDal = null
  before(() => {
    const config = {
      host: 'localhost',
      port: 27017,
      db: 'YoYo-dev',
      collectionName: 'Comments-test',
    }
    commentDal = new Dal(config)
  })

  it('create and find', async () => {
    const obj = mockAComment()
    await commentDal.create(obj)
    const ret = await commentDal.find({})

    expect(ret).to.be.an.instanceof(Array)
    expect(ret.length >= 1).to.equal(true)
    const createdComment = ret[ret.length - 1]
    expect(createdComment.user).to.eql(obj.user)
    expect(createdComment.uri).to.eql(obj.uri)
    expect(createdComment.text).to.eql(obj.text)
  })
})
