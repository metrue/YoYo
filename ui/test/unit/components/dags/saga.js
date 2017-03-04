import expect from 'expect.js';
import { take, fork } from 'redux-saga/effects';

import { watchers, workers } from '../../../../ui/components/dags/saga';
import types from '../../../../ui/components/dags/types';
import api from '../../../../ui/api';
import { constructExpectCallReturn } from '../../../../ui/utils';


const {
  FETCH,
  PRODUCE,
  REFRESH,
} = types;

describe('components/dags/saga', () => {
  let fetchWatcher;
  let produceWatcher;
  let refreshWatcher;
  let fetchWorker;
  let produceWorker;
  let refreshWorkfer;
  let actualYield;
  let expectedYield;

  before(() => {
    fetchWatcher = watchers[0]();
    produceWatcher = watchers[1]();
    refreshWatcher = watchers[2]();

    fetchWorker = workers[0];
    produceWorker = workers[1];
    refreshWorkfer = workers[2];
  });


  describe('components/dags/saga/watchers', () => {
    describe('FETCH', () => {
      const action = { type: FETCH };

      it('should take on FETCH action ', () => {
        actualYield = fetchWatcher.next().value;
        expectedYield = take(FETCH, fetchWorker);
        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(fetchWorker, action);
        actualYield = fetchWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the FETCH action again', () => {
        actualYield = fetchWatcher.next().value;
        expectedYield = take(FETCH);
        expect(actualYield).to.eql(expectedYield);
      });
    });

    describe('PRODUCE', () => {
      const action = { type: PRODUCE };
      it('should take on PRODUCE action', () => {
        expectedYield = take(PRODUCE);
        actualYield = produceWatcher.next(action).value;

        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(produceWorker, action);
        actualYield = produceWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the FETCH action again', () => {
        actualYield = produceWatcher.next().value;
        expectedYield = take(PRODUCE);
        expect(actualYield).to.eql(expectedYield);
      });
    });

    describe('REFRESH', () => {
      const action = { type: REFRESH };
      it('should take on REFRESH', () => {
        expectedYield = take(REFRESH, refreshWorkfer);
        actualYield = refreshWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(refreshWorkfer, action);
        actualYield = refreshWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the FETCH action again', () => {
        actualYield = refreshWatcher.next().value;
        expectedYield = take(REFRESH);
        expect(actualYield).to.eql(expectedYield);
      });
    });
  });

  describe('components/dags/saga/workers', () => {
    it('fetch', () => {
      const action = { type: FETCH };
      const fetcherIterator = fetchWorker(action);

      expectedYield = constructExpectCallReturn(api.fetchDags, []);
      actualYield = fetcherIterator.next().value;
      expect(expectedYield).to.eql(actualYield);
    });

    it('refresh', () => {
      const domain = 'dag1';
      const version = '0.0.1';
      const action = { type: REFRESH, options: { dags: [{ domain, data_version: version }] } };
      const refresherIterator = refreshWorkfer(action);

      expectedYield = constructExpectCallReturn(api.refreshDag, [domain, version]);
      actualYield = refresherIterator.next().value;
      expect(expectedYield).to.eql(actualYield);
    });

    it('produce', () => {
      const domain = 'test-domain';
      const version = 'test-version';
      const key = '123';
      const action = { type: 'PRODUCE', options: { domain, version, key } };
      const producerIterator = produceWorker(action);

      expectedYield = constructExpectCallReturn(api.produce, [domain, version, key]);
      actualYield = producerIterator.next().value;
      expect(expectedYield).to.eql(actualYield);
    });
  });
});
