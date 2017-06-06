const { uniqueNames, appendUniqueName } = require('../../src/utils')

describe('utils', () => {
  it('should generate unique name from a array of emails', () => {
    const emails = [
      'a@a.com',
      'b@b.com',
      'a@b.com',
    ]
    const names = uniqueNames(emails)
    expect(names).toEqual(['a', 'b', 'a1'])
  })

  it('should generate unique name from a array of comments', () => {
    const comments = [{
      user: 'a@a.com',
      uri: 'https://a.com/1',
      text: 'text-1',
    }, {
      user: 'b@b.com',
      uri: 'https://a.com/2',
      text: 'text-2',
    }, {
      user: 'a@b.com',
      uri: 'https://a.com/2',
      text: 'text-2',
    }, {
      user: 'a@a.com',
      uri: 'https://a.com/1',
      text: 'text-1',
    }, {
      user: 'a@c.com',
      uri: 'https://a.com/1',
      text: 'text-1',
    }]
    const nameAppendedComments = appendUniqueName(comments)
    expect(nameAppendedComments).toEqual([{
      user: 'a@a.com',
      name: 'a',
      uri: 'https://a.com/1',
      text: 'text-1',
    }, {
      user: 'b@b.com',
      name: 'b',
      uri: 'https://a.com/2',
      text: 'text-2',
    }, {
      user: 'a@b.com',
      name: 'a1',
      uri: 'https://a.com/2',
      text: 'text-2',
    }, {
      user: 'a@a.com',
      name: 'a',
      uri: 'https://a.com/1',
      text: 'text-1',
    }, {
      user: 'a@c.com',
      name: 'a2',
      uri: 'https://a.com/1',
      text: 'text-1',
    }])
  })
})
