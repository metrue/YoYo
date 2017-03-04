import actions from '../../../../ui/components/jobs/actions';
import expect from 'expect.js';
import types from '../../../../ui/components/jobs/types';
const { FETCH, SELECT, RESTART, BATCH_RESTART } = types;

describe('components/jobs/actions', () => {
  it('should have fetch action', () => {
    const options = { status: 'errored' };
    const expectAction = { type: FETCH, options };
    const action = actions.fetch(options);
    expect(action).to.eql(expectAction);
  });

  it('should have select action', () => {
    const options = { name: 'B', version: '0' };
    const action = actions.select(options);
    const expectAction = { type: SELECT, options };
    expect(action).to.eql(expectAction);
  });

  it('should have restart action', () => {
    const options = { name: 'A', version: '0' };
    const action = actions.restart(options);
    const expectAction = { type: RESTART, options };
    expect(action).to.eql(expectAction);
  });

  it('should have batch restart actoin', () => {
    const options = { name: 'A', version: '0', key: '20150606' };
    const action = actions.batchRestart(options);
    const expectAction = { type: BATCH_RESTART, options };
    expect(action).to.eql(expectAction);
  });
});
