import expect from 'expect.js';
const cache = require('../../../ui/components/cache');

describe('components/cache', () => {
  it('should singleton', () => {
    // eslint-disable-next-line
    const cache1 = require('../../../ui/components/cache');
    // eslint-disable-next-line
    const cache2 = require('../../../ui/components/cache');
    expect(cache1).to.equal(cache2);
  });

  it('should set', () => {
    const key = 'name';
    const value = 'name';
    cache.set(key, value);
    expect(cache.get(key)).to.equal(value);
  });
});
