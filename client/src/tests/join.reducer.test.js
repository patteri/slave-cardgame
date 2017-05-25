import { expect } from 'chai';
import joinReducer from '../components/Join/reducer';
import { gameIdChanged } from '../components/Join/actions';

describe('Join reducer', () => {
  it('Successful gameIdChanged', () => {
    const initialState = joinReducer(undefined, { type: '' });
    expect(initialState.isButtonDisabled).to.equal(true);
    const reducer = joinReducer(initialState, gameIdChanged('a'));
    expect(reducer.gameId).to.equal('a');
    expect(reducer.isButtonDisabled).to.equal(false);
  });
});
