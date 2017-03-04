import reducer from '../../../../ui/components/dags/reducer';
import expect from 'expect.js';
import { Map } from 'immutable';
import types from '../../../../ui/components/dags/types';

const {
  SELECT,
  FETCH,
  FETCH_SECCESS,
  PRODUCE,
  REFRESH,
} = types;

describe('components/dags/reducer', () => {
  it('should named "dags"', () => {
    expect(reducer.name).to.equal('dags');
  });

  it('should init state', () => {
    const state = reducer.init;
    expect(state).to.a(Map);
    const list = state.get('list');
    expect(list).to.be.a(Array);
    expect(list.length).to.equal(0);
    const fetching = state.get('isFetching');
    expect(fetching).to.equal(false);
  });

  describe('reduce', () => {
    it('should set fetching', () => {
      const initState = reducer.init;
      const action = { type: FETCH };
      const nextState = reducer.reduce(initState, action);
      expect(nextState.get('isFetching')).to.equal(true);
    });

    it('should update list', () => {
      const state = reducer.init;
      const dags = ['a'];
      const action = { type: FETCH_SECCESS, dags };
      const nextState = reducer.reduce(state, action);
      const list = nextState.get('list');
      expect(list.length).to.equal(1);
      expect(list[0]).to.equal('a');
    });

    it('should update selected', () => {
      const dag1 = { domain: 'A', data_version: 0 };
      const dag2 = { domain: 'B', data_version: 0 };

      const state = new Map({
        list: [dag1, dag2],
        fetching: false,
      });

      const action = { type: SELECT, options: { dag: dag1, all: false, checked: null } };
      const nextState = reducer.reduce(state, action);

      const dags = nextState.get('list');
      expect(dags.length).to.equal(2);

      expect(dags[0].domain).to.equal('A');
      expect(dags[0].data_version).to.equal(0);
      expect(dags[0].selected).to.equal(true);

      expect(dags[1].domain).to.equal('B');
      expect(dags[1].data_version).to.equal(0);
      expect(!!dags[1].selected).to.equal(false);
    });

    it('should update refreshing status', () => {
      const dag1 = { domain: 'A', data_version: 1 };
      const dag2 = { domain: 'B', data_version: 2 };
      const dag3 = { domain: 'C', data_version: 3 };

      const state = new Map({
        list: [dag1, dag2, dag3],
        isFetching: false,
      });

      const action = { type: REFRESH, options: { dags: [dag2, dag3] } };
      const s1 = reducer.reduce(state, action);

      const REFRESH_STATUS_RUNING = 0;
      for (const d of s1.get('list')) {
        if (d.domain === dag1.domain && d.data_version === dag1.data_version) {
          expect(d.isRefreshing).to.equal(undefined);
        } else {
          expect(d.isRefreshing).to.equal(REFRESH_STATUS_RUNING);
        }
      }
    });

    it('should update producing status', () => {
      const state = reducer.init;
      const action = { type: PRODUCE, value: true };
      const s1 = reducer.reduce(state, action);
      expect(s1.get('isProducing')).to.equal(true);

      action.value = false;
      const s2 = reducer.reduce(s1, action);
      expect(s2.get('isProducing')).to.equal(false);
    });
  });
});

