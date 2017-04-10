import Comments from '../../src/server/dal/comments'
import { expect } from 'chai'

const mockAComment = () => (
  {
    user: `test-user-${Math.random().toString(36).substring(7)}`,
    uri: `https://minghe.me/${Math.random().toString(36).substring(7)}.html`,
    text: `test-comment-text-${Math.random().toString(36).substring(7)}`,
  }
)
describe('Comments', () => {
  let commentDal = null
  before(() => {
    const config = {
      host: 'localhost',
      port: 27017,
      db: 'YoYo-dev',
    }
    commentDal = new Comments(config)
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

  after(async () => {
    await commentDal.dal.mongo.close()
  })
})
