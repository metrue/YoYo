const { trimHTTPOrHTTPS } = require('../utils')


describe('utils', () => {
  test('trimHTTPOrHTTPS', () => {
    const url1 = "https://abc.com"
    expect(trimHTTPOrHTTPS(url1)).toEqual("abc.com")
    const url2 = "http://abc.com"
    expect(trimHTTPOrHTTPS(url2)).toEqual("abc.com")

    const url3 = "HTTP://abc.com"
    expect(trimHTTPOrHTTPS(url3)).toEqual("abc.com")
  })
})
