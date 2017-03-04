import actions from '../../../../ui/components/dags/actions';
import expect from 'expect.js';
import types from '../../../../ui/components/dags/types';
const { FETCH, SELECT, REFRESH, PRODUCE } = types;

describe('components/dags/actions', () => {
  it('should have fetch action', () => {
    const expectAction = { type: FETCH };
    const action = actions.fetch();
    expect(action).to.eql(expectAction);
  });

  it('should have select action', () => {
    const options = { domain: 'B', version: '0' };
    const action = actions.select(options);
    const expectAction = { type: SELECT, options };
    expect(action).to.eql(expectAction);
  });

  it('should have refresh action', () => {
    const options = { domain: 'A', version: '0' };
    const action = actions.refresh(options);
    const expectAction = { type: REFRESH, options };
    expect(action).to.eql(expectAction);
  });

  it('should have produce actoin', () => {
    const options = { domain: 'A', version: '0', key: '20150606' };
    const action = actions.produce(options);
    const expectAction = { type: PRODUCE, options };
    expect(action).to.eql(expectAction);
  });
});
