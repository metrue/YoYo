import { expect } from 'chai'
import { uniqueNames } from '../../src/utils'

describe('utils', () => {
  it('should generate unique name from a array of emails', () => {
    const emails = [
      'a@a.com',
      'b@b.com',
      'a@b.com',
    ]
    const names = uniqueNames(emails)
    expect(names).to.eql(['a', 'b', 'a1'])
  })
})
