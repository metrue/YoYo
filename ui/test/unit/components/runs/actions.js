import actions from '../../../../ui/components/runs/actions';
import expect from 'expect.js';
import types from '../../../../ui/components/runs/types';
const { FETCH, SELECT, RESTART, PRODUCE, UPDATE_PRIORITY } = types;

describe('components/runs/actions', () => {
  it('should have fetch action', () => {
    const options = { status: 'errored' };
    const expectAction = { type: FETCH, options };
    const action = actions.fetch(options);
    expect(action).to.eql(expectAction);
  });

  it('should have select action', () => {
    const options = { domain: 'B', version: '0', key: '20012020' };
    const action = actions.select(options);
    const expectAction = { type: SELECT, options };
    expect(action).to.eql(expectAction);
  });

  it('should have restart action', () => {
    const runs = [];
    const query = {};
    const action = actions.restart(runs, query);
    const expectAction = { type: RESTART, options: { runs: [], query: {} } };
    expect(action).to.eql(expectAction);
  });

  it('should have produce action', () => {
    const options = { domin: 'A', version: '0' };
    const action = actions.produce(options);
    const expectAction = { type: PRODUCE, options };
    expect(action).to.eql(expectAction);
  });

  it('should have update priority actoin', () => {
    const options = { name: 'A', version: '0', key: '20150606', priority: '-1' };
    const action = actions.updatePriority(options);
    const expectAction = { type: UPDATE_PRIORITY, options };
    expect(action).to.eql(expectAction);
  });
});
