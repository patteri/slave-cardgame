import { expect } from 'chai';
import homeReducer from '../components/Home/reducer';
import {
  playerCountChanged,
  cpuPlayerCountChanged,
  gameCountChanged } from '../components/Home/actions';

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
    expect(reducer.cpuPlayerCount).to.equal(0);
  });

  it('Successful gameCountChanged', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, gameCountChanged(5));
    expect(reducer.gameCount).to.equal(5);
  });

  it('Invalid gameCountChanged: number too small', () => {
    const initialState = homeReducer(undefined, { type: '' });
    const reducer = homeReducer(initialState, gameCountChanged(0));
    expect(reducer.gameCount).to.equal(initialState.gameCount);
  });
});
