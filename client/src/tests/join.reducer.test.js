import { expect } from 'chai';
import joinReducer from '../components/Join/reducer';
import { gameIdChanged } from '../components/Join/actions';
import { playerNameChanged } from '../components/Home/actions';

describe('Home reducer', () => {
  it('Successful gameIdChanged', () => {
    const initialState = joinReducer(undefined, { type: '' });
    const reducer = joinReducer(initialState, gameIdChanged('a'));
    expect(reducer.gameId).to.equal('a');
  });

  it('Invalid gameIdChanged: no characters', () => {
    const initialState = joinReducer(undefined, { type: '' });
    let reducer = joinReducer(initialState, gameIdChanged(''));
    reducer = joinReducer(reducer, playerNameChanged('test'));
    expect(reducer.isButtonDisabled).to.equal(true);
  });

  it('Successful playerNameChanged', () => {
    const initialState = joinReducer(undefined, { type: '' });
    let reducer = joinReducer(initialState, gameIdChanged('a'));
    reducer = joinReducer(reducer, playerNameChanged('test'));
    expect(reducer.playerName).to.equal('test');
    expect(reducer.isButtonDisabled).to.equal(false);
  });

  it('Invalid playerNameChanged: no characters', () => {
    const initialState = joinReducer(undefined, { type: '' });
    let reducer = joinReducer(initialState, gameIdChanged('a'));
    reducer = joinReducer(reducer, playerNameChanged(''));
    expect(reducer.isButtonDisabled).to.equal(true);
  });

  it('Invalid playerNameChanged: too many characters', () => {
    const initialState = joinReducer(undefined, { type: '' });
    let reducer = joinReducer(initialState, gameIdChanged('a'));
    reducer = joinReducer(reducer, playerNameChanged('1234567890abc'));
    expect(reducer.isButtonDisabled).to.equal(true);
  });
});
