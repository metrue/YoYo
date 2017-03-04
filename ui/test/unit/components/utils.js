import { isInDag, equalOptions, leftpad, toQueryString } from '../../../ui/components/utils';
import expect from 'expect.js';

describe('components/utils', () => {
  describe('equalOptions', () => {
    it('empty obj', () => {
      const srcObj = {};
      const destObj = {};
      const eql = equalOptions(srcObj, destObj);
      expect(eql).to.equal(true);
    });

    it('objects with one key have different values', () => {
      const srcObj = { name: 'src' };
      const destObj = { name: 'dest' };
      const eql = equalOptions(srcObj, destObj);
      expect(eql).to.equal(false);
    });

    it('objects has same keys same values', () => {
      const srcObj = { name: 'src' };
      const destObj = { name: 'src' };
      const eql = equalOptions(srcObj, destObj);
      expect(eql).to.equal(true);
    });

    it('object has more key', () => {
      const srcObj = { name: 'src' };
      const destObj = { name: 'src', age: '20' };
      const eql = equalOptions(srcObj, destObj);
      expect(eql).to.equal(false);
    });
  });

  describe('leftpad', () => {
    it('should append spaces', () => {
      const srcString = '1';
      const processedString = leftpad(srcString, 3);
      expect(processedString).to.equal('  1');
    });
  });

  describe('toQueryString', () => {
    it('should get query string', () => {
      const options = { name: 'A' };
      const queryString = toQueryString(options);
      expect(queryString).to.equal('name=A');

      const opt = { name: 'A', age: '20' };
      const optQueryString = toQueryString(opt);
      expect(optQueryString).to.equal('name=A&age=20');
    });

    it('should be able query string 1-nested object', () => {
      const opt = { name: 'A', age: '20', fields: { created_at: 'ASC' } };
      const optQueryString = toQueryString(opt);
      expect(optQueryString).to.equal('name=A&age=20&fields%5Bcreated_at%5D=ASC');
    });
  });

  describe('isInDag', () => {
    it('should not in dag', () => {
      const dag = { "abc": {} };
      const name = 'motion';
      expect(isInDag(name, dag)).to.equal(false);
    });
  });
});
