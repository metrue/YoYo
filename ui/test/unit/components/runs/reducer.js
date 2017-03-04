import reducer from '../../../../ui/components/runs/reducer';
import expect from 'expect.js';
import { Map } from 'immutable';
import types from '../../../../ui/components/runs/types';
const { FETCH, FETCH_SUCCESS, SELECT, PRODUCING, PRODUCED, RESTART, RESTART_SUCCESS, UPDATE_PRIORITY, UPDATE_PRIORITY_SUCCESS } = types;

describe('components/runs/reducer', () => {
  it('should named "runs"', () => {
    expect(reducer.name).to.equal('runs');
  });

  it('should init state', () => {
    const state = reducer.init;
    expect(state).to.a(Map);
    const list = state.get('list');
    expect(list).to.be.a(Array);
    expect(list.length).to.equal(0);
    const fetching = state.get('fetching');
    expect(fetching).to.equal(false);
    const produce = state.get('produce');
    expect(produce).to.eql({ isProducing: false, total: 0, produced: 0 });
    const redirect = state.get('redirect');
    expect(redirect).to.equal(null);
  });

  describe('reduce', () => {
    it('should set fetching', () => {
      const initState = reducer.init;
      const action = { type: FETCH };
      const nextState = reducer.reduce(initState, action);
      expect(nextState.get('fetching')).to.equal(true);
    });

    it('should update list', () => {
      const state = reducer.init;
      const runs = ['a'];
      const action = { type: FETCH_SUCCESS, options: { list: runs } };
      const nextState = reducer.reduce(state, action);
      const list = nextState.get('list');
      expect(list.length).to.equal(1);
      expect(list[0]).to.equal('a');
    });

    it('should update selected', () => {
      const run1 = { key: 'A', id: 0 };
      const run2 = { key: 'B', id: 0 };

      const state = new Map({
        list: [run1, run2],
        fetching: false,
      });

      const action = { type: SELECT, options: { key: run1.key, all: false, checked: null } };
      const nextState = reducer.reduce(state, action);

      const runs = nextState.get('list');
      expect(runs[0].key).to.equal('A');
      expect(runs[0].id).to.equal(0);
      expect(runs[0].selected).to.equal(true);
    });

    it('should produce', () => {
      const state = reducer.init;
      let action = { type: PRODUCING, options: { total: 1, produced: 0 } };
      let nextState = reducer.reduce(state, action);
      let produce = nextState.get('produce');
      expect(produce).to.eql({ isProducing: true, total: 1, produced: 0 });

      action = { type: PRODUCED };
      nextState = reducer.reduce(nextState, action);
      produce = nextState.get('produce');
      expect(produce).to.eql({ isProducing: false, total: 0, produced: 0 });
    });

    it('should restart run', () => {
      const run1 = { key: 'A', id: 0 };
      const run2 = { key: 'B', id: 1 };
      const run3 = { key: 'C', id: 2 };

      const state = new Map({
        list: [run1, run2, run3],
        fetching: false,
        producing: false,
        redirect: null,
      });

      const action = { type: RESTART, options: { runs: [run1] } };
      const nextState = reducer.reduce(state, action);
      const runs = nextState.get('list');
      runs.forEach((run) => {
        if (run.id === run1.id) {
          expect(run.restartStatus).to.equal('restarting');
        }
      });
    });

    it('should restarted run', () => {
      const run1 = { key: 'A', id: 0 };
      const run2 = { key: 'B', id: 1 };
      const run3 = { key: 'C', id: 2 };

      const state = new Map({
        list: [run1, run2, run3],
        fetching: false,
        producing: false,
        redirect: null,
      });

      const action = { type: RESTART_SUCCESS, options: { run: run1 } };
      const nextState = reducer.reduce(state, action);
      const runs = nextState.get('list');
      runs.forEach((run) => {
        if (run1.id === run.id) {
          expect(run.restartStatus).to.equal('restarted');
        }
      });
    });

    it('should update priority', () => {
      const run1 = { key: 'A', id: 0 };
      const run2 = { key: 'B', id: 1 };
      const run3 = { key: 'C', id: 2 };

      const state = new Map({
        list: [run1, run2, run3],
        fetching: false,
        producing: false,
        redirect: null,
      });

      const action = { type: UPDATE_PRIORITY, options: { key: run1.key, priority: 'high' } };
      const nextState = reducer.reduce(state, action);
      const runs = nextState.get('list');
      runs.forEach((run) => {
        if (run.key === action.options.key) {
          expect(run.priority).to.equal(action.options.priority);
          expect(run.updatingPriority).to.equal(true);
        }
      });
    });

    it('should updated priority', () => {
      const run1 = { key: 'A', id: 0 };
      const run2 = { key: 'B', id: 1 };
      const run3 = { key: 'C', id: 2 };

      const state = new Map({
        list: [run1, run2, run3],
        fetching: false,
        producing: false,
        redirect: null,
      });

      const action = { type: UPDATE_PRIORITY_SUCCESS, options: { key: run1.key } };
      const nextState = reducer.reduce(state, action);
      const runs = nextState.get('list');
      runs.forEach((run) => {
        if (run.key === action.options.key) {
          expect(run.updatingPriority).to.equal(false);
        }
      });
    });
  });
});

