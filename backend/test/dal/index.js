import Dal from '../../lib/server/dal/dal'
import { expect } from 'chai'

describe('Dal', () => {
  let dal = null
  const name = 'test-col'
  before(() => {
    const config = {
      host: 'localhost',
      port: 27017,
      db: 'YoYo-dev',
    }
    dal = new Dal(config)
  })

  it('get collection', async() => {
    const col = await dal.collection(name)
    expect(col.collectionName).to.equal(name)
  })

  it('save and find', async () => {
    const obj = { message: 'hello world' }
    await dal.save(name, obj)
    const ret = await dal.find(name, {})

    expect(ret).to.be.an.instanceof(Array)
    expect(ret.length >= 1).to.equal(true)
    expect(ret[ret.length - 1]).to.eql(obj)
  })

  after(async () => {
    await dal.mongo.close()
  })
})
