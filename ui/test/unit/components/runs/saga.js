import expect from 'expect.js';
import { take, fork } from 'redux-saga/effects';

import { watchers, workers } from '../../../../ui/components/runs/saga';
import types from '../../../../ui/components/runs/types';

const {
  FETCH,
  RESTART,
  PRODUCE,
  UPDATE_PRIORITY,
} = types;

describe('components/runs/saga', () => {
  let fetchWatcher;
  let fetchWorker;
  let restartWatcher;
  let restartWorker;
  let produceWatcher;
  let produceWorker;
  let priorityUpdateWatcher;
  let priorityUpdateWorker;

  let actualYield;
  let expectedYield;

  before(() => {
    fetchWatcher = watchers[0]();
    restartWatcher = watchers[1]();
    produceWatcher = watchers[2]();
    priorityUpdateWatcher = watchers[3]();

    fetchWorker = workers[0];
    restartWorker = workers[1];
    produceWorker = workers[2];
    priorityUpdateWorker = workers[3];
  });


  describe('components/runs/saga/watchers', () => {
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

    describe('PRODUCE', () => {
      const action = { type: PRODUCE };
      it('should take on PRODUCE', () => {
        expectedYield = take(PRODUCE, produceWorker);
        actualYield = produceWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(produceWorker, action);
        actualYield = produceWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the PRODUCE action again', () => {
        actualYield = produceWatcher.next().value;
        expectedYield = take(PRODUCE);
        expect(actualYield).to.eql(expectedYield);
      });
    });

    describe('UPDATE_PRIORITY', () => {
      const action = { type: UPDATE_PRIORITY };
      it('should take on CANCEL action', () => {
        expectedYield = take(UPDATE_PRIORITY);
        actualYield = priorityUpdateWatcher.next(action).value;

        expect(expectedYield).to.eql(actualYield);
      });

      it('should fork the saga handler with action', () => {
        expectedYield = fork(priorityUpdateWorker, action);
        actualYield = priorityUpdateWatcher.next(action).value;
        expect(expectedYield).to.eql(actualYield);
      });

      it('should return to capturing the UPDATE_PRIORITY action again', () => {
        actualYield = priorityUpdateWatcher.next().value;
        expectedYield = take(UPDATE_PRIORITY);
        expect(actualYield).to.eql(expectedYield);
      });
    });
  });

  // TODO worker testing
});
