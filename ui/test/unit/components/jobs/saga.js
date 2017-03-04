import expect from 'expect.js';
import { take, fork } from 'redux-saga/effects';

import { watchers, workers } from '../../../../ui/components/jobs/saga';
import types from '../../../../ui/components/jobs/types';
import api from '../../../../ui/api';

const {
  FETCH,
  RESTART,
  BATCH_RESTART,
  CANCEL,
} = types;

describe('components/jobs/saga', () => {
  let fetchWatcher;
  let fetchWorker;
  let restartWatcher;
  let restartWorker;
  let batchRestartWatcher;
  let batchRestartWorker;
  let cancellWatcher;
  let cancellWorker;

  let actualYield;
  let expectedYield;

  before(() => {
    fetchWatcher = watchers[0]();
    restartWatcher = watchers[1]();
    batchRestartWatcher = watchers[2]();
    cancellWatcher = watchers[3]();

    fetchWorker = workers[0];
    restartWorker = workers[1];
    batchRestartWorker = workers[2];
    cancellWorker = workers[3];
  });


  describe('components/jobs/saga/watchers', () => {
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

    describe('RESTART', () => {
      const action = { type: RESTART };
      it('should take on RESTART action', () => {
        expectedYield = take(RESTART);
        actualYield = restartWatcher.next(action).value;

        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(restartWorker, action);
        actualYield = restartWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the FETCH action again', () => {
        actualYield = restartWatcher.next().value;
        expectedYield = take(RESTART);
        expect(actualYield).to.eql(expectedYield);
      });
    });

    describe('BATCH_RESTART', () => {
      const action = { type: BATCH_RESTART };
      it('should take on BATCH_RESTART', () => {
        expectedYield = take(BATCH_RESTART, batchRestartWorker);
        actualYield = batchRestartWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(batchRestartWorker, action);
        actualYield = batchRestartWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the FETCH action again', () => {
        actualYield = batchRestartWatcher.next().value;
        expectedYield = take(BATCH_RESTART);
        expect(actualYield).to.eql(expectedYield);
      });
    });

    describe('CANCEL', () => {
      const action = { type: RESTART };
      it('should take on CANCEL action', () => {
        expectedYield = take(CANCEL);
        actualYield = cancellWatcher.next(action).value;

        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(cancellWorker, action);
        actualYield = cancellWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the FETCH action again', () => {
        actualYield = cancellWatcher.next().value;
        expectedYield = take(CANCEL);
        expect(actualYield).to.eql(expectedYield);
      });
    });
  });

  // TODO worker testing
});
