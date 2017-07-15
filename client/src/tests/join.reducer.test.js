import { expect } from 'chai';
import joinReducer from '../components/Join/reducer';
import {
  gameIdChanged,
  usernameChanged
} from '../components/Join/actions';

describe('Join reducer', () => {
  it('Successful gameIdChanged', () => {
    const initialState = joinReducer(undefined, { type: '' });
    const reducer = joinReducer(initialState, gameIdChanged('a'));
    expect(reducer.gameId).to.equal('a');
  });

  it('Successful usernameChanged', () => {
    const initialState = joinReducer(undefined, { type: '' });
    const reducer = joinReducer(initialState, usernameChanged({ username: 'player', isValid: true }));
    expect(reducer.username).to.equal('player');
    expect(reducer.isUsernameValid).to.equal(true);
  });

  it('Successful isButtonDisabled', () => {
    const initialState = joinReducer(undefined, { type: '' });
    expect(initialState.isButtonDisabled).to.equal(true);
    let reducer = joinReducer(initialState, usernameChanged({ username: 'player', isValid: true }));
    expect(reducer.isButtonDisabled).to.equal(true);
    reducer = joinReducer(reducer, gameIdChanged('a'));
    expect(reducer.isButtonDisabled).to.equal(false);
  });
});
