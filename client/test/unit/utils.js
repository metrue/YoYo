import { expect } from 'chai'
import {
  maybeEmailAddress,
} from '../../src/utils'

describe('utils', () => {
  it('maybeEmailAddress', () => {
    let wrongEmail = 'abc'
    expect(maybeEmailAddress(wrongEmail)).to.equal(false)
    wrongEmail = ''
    expect(maybeEmailAddress(wrongEmail)).to.equal(false)
    let correctEmail = 'h.minghe@gmail.com'
    expect(maybeEmailAddress(correctEmail)).to.equal(true)
    correctEmail = 'hMing@qq.com'
    expect(maybeEmailAddress(correctEmail)).to.equal(true)
  })
})
