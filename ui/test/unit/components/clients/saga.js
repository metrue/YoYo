import expect from 'expect.js';

import { take, fork } from 'redux-saga/effects';
import { watchers, workers } from '../../../../ui/components/clients/saga';
import types from '../../../../ui/components/clients/types';
import { constructExpectCallReturn } from '../../../../ui/utils';
import api from '../../../../ui/api';

const { FETCH } = types;

describe('components/clients/saga', () => {
  let fetchWatcher;
  let fetchWorker;
  let actualYield;
  let expectedYield;

  before(() => {
    fetchWatcher = watchers[0]();

    fetchWorker = workers[0];
  });


  describe('components/clients/saga/watchers', () => {
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
  });

  describe('components/dags/saga/workers', () => {
    it('fetch', () => {
      const domain = 'test-domain';
      const version = 'test-version';
      const action = { type: FETCH, options: { domain, version } };
      const fetcherIterator = fetchWorker(action);

      expectedYield = constructExpectCallReturn(api.fetchClients, [domain, version]);
      actualYield = fetcherIterator.next().value;
      expect(expectedYield).to.eql(actualYield);
    });
  });
});
