import { expect } from 'chai';
import homeReducer from '../components/Home/reducer';
import {
  playerCountChanged,
  cpuPlayerCountChanged,
  playerNameChanged } from '../components/Home/actions';

describe('Home reducer', () => {
  it('Successful playerCountChanged', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, playerCountChanged(5));
    expect(reducer.playerCount).to.equal(5);
  });

  it('Invalid playerCountChanged: number exceeds', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, playerCountChanged(3));
    expect(reducer.playerCount).to.equal(4);
  });

  it('playerCountChanged: string converts to integer', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, playerCountChanged('5'));
    expect(reducer.playerCount).to.equal(5);
    expect(typeof reducer.playerCount).to.equal('number');
  });

  it('playerCountChanged: cpu count is less than player count', () => {
    const initialState = homeReducer(undefined, { type: '' });
    let reducer = homeReducer(initialState, playerCountChanged(5));
    reducer = homeReducer(reducer, cpuPlayerCountChanged(4));
    expect(reducer.cpuPlayerCount).to.equal(4);
    reducer = homeReducer(reducer, playerCountChanged(4));
    expect(reducer.cpuPlayerCount).to.equal(3);
  });

  it('cpuPlayerCountChanged: cpu count is less than player count', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, cpuPlayerCountChanged(4));
    expect(reducer.cpuPlayerCount).to.equal(3);
  });

  it('Successful playerNameChanged', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, playerNameChanged('test'));
    expect(reducer.playerName).to.equal('test');
    expect(reducer.isButtonDisabled).to.equal(false);
  });

  it('Invalid playerNameChanged: no characters', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, playerNameChanged(''));
    expect(reducer.isButtonDisabled).to.equal(true);
  });

  it('Invalid playerNameChanged: too many characters', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, playerNameChanged('1234567890abc'));
    expect(reducer.isButtonDisabled).to.equal(true);
  });
});
