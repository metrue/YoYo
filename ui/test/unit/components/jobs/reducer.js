import reducer from '../../../../ui/components/jobs/reducer';
import expect from 'expect.js';
import { Map } from 'immutable';
import types from '../../../../ui/components/jobs/types';
const { FETCH, PUT, SELECT, RESTART, RESTARTING, RESTARTED } = types;

describe('components/jobs/reducer', () => {
  it('should named "jobs"', () => {
    expect(reducer.name).to.equal('jobs');
  });

  it('should init state', () => {
    const state = reducer.init;
    expect(state).to.a(Map);

    const list = state.get('list');
    expect(list).to.be.a(Array);
    expect(list.length).to.equal(0);

    const fetching = state.get('fetching');
    expect(fetching).to.equal(true);

    const redirect = state.get('redirect');
    expect(redirect).to.equal(null);

    const restarting = state.get('restarting');
    expect(restarting).to.be.a(Array);
    expect(restarting.length).to.equal(0);

    const restarted = state.get('restarted');
    expect(restarted).to.be.a(Array);
    expect(restarted.length).to.equal(0);

    const query = state.get('query');
    expect(query).to.have.property('key', '');
    expect(query).to.have.property('name', '');
    expect(query).to.have.property('is', true);
    expect(query).to.have.property('status', '');
    expect(query).to.have.property('page', 1);
    expect(query).to.have.property('limit', 50);
  });

  describe('reduce', () => {
    it('should set fetching', () => {
      const initState = reducer.init;
      const action = { type: FETCH };
      const nextState = reducer.reduce(initState, action);
      expect(nextState.get('fetching')).to.equal(true);
      expect(nextState.get('redirect')).to.equal(null);
      expect(nextState.get('list').length).to.equal(0);
    });

    it('should update list', () => {
      const state = reducer.init;
      const jobs = ['a'];
      const dag = {};
      const query = { domain: 'A', version: 0 };
      const action = { type: PUT, jobs, query, dag };
      const nextState = reducer.reduce(state, action);

      const list = nextState.get('list');
      expect(list.length).to.equal(1);

      const fetching = nextState.get('fetching');
      expect(fetching).to.equal(false);

      const updatedQuery = nextState.get('query');
      expect(updatedQuery).to.have.property('domain', 'A');
      expect(updatedQuery).to.have.property('version', 0);
    });

    it('should update selected', () => {
      const job1 = { name: 'A', id: 0 };
      const job2 = { name: 'B', id: 0 };

      const state = new Map({
        list: [job1, job2],
        fetching: false,
      });

      const action = { type: SELECT, options: { jobId: job1.id, all: false, checked: null } };
      const nextState = reducer.reduce(state, action);

      const runs = nextState.get('list');
      expect(runs[0].name).to.equal('A');
      expect(runs[0].id).to.equal(0);
      expect(runs[0].selected).to.equal(true);
    });

    it('should restart jobs', () => {
      const job1 = { name: 'A', id: 0 };
      const job2 = { name: 'B', id: 1 };
      const job3 = { name: 'C', id: 2 };

      const state = new Map({
        list: [job1, job2, job3],
        fetching: false,
        producing: false,
        redirect: null,
      });

      const action = { type: RESTART, options: { jobs: [job1, job2] } };
      const nextState = reducer.reduce(state, action);
      const jobs = nextState.get('list');
      jobs.forEach((job) => {
        action.options.jobs.forEach((j) => {
          if (j.id === job.id) {
            expect(job.restartStatus).to.equal('pending');
          }
        });
      });
    });

    it('should restarting jobs', () => {
      const job1 = { name: 'A', id: 0 };
      const job2 = { name: 'B', id: 1 };
      const job3 = { name: 'C', id: 2 };

      const state = new Map({
        list: [job1, job2, job3],
        fetching: false,
        producing: false,
        redirect: null,
      });

      const action = { type: RESTARTING, jobs: [job1, job2] };
      const nextState = reducer.reduce(state, action);
      const jobs = nextState.get('list');
      jobs.forEach((job) => {
        action.jobs.forEach((j) => {
          if (j.id === job.id) {
            expect(job.restartStatus).to.equal('restarting');
          }
        });
      });
    });

    it('should restarted jobs', () => {
      const job1 = { name: 'A', id: 0 };
      const job2 = { name: 'B', id: 1 };
      const job3 = { name: 'C', id: 2 };

      const state = new Map({
        list: [job1, job2, job3],
        fetching: false,
        producing: false,
        redirect: null,
      });

      const action = { type: RESTARTED, jobs: [job1, job2] };
      const nextState = reducer.reduce(state, action);
      const jobs = nextState.get('list');
      jobs.forEach((job) => {
        action.jobs.forEach((j) => {
          if (j.id === job.id) {
            expect(job.restartStatus).to.equal('restarted');
          }
        });
      });
    });
  });
});

