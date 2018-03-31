import { expect } from 'chai';
import gameReducer from '../components/Game/reducers/gameReducer';
import {
  joinedPlayersChanged,
  gameStarted,
  gameUpdated,
  gameEnded,
  newRoundStarted } from '../components/Game/actions';
import { GameState } from '../shared/constants';

const getGameData = () => ({
  game: {
    id: 1,
    playerCount: 4,
    players: [
      { name: 'Player1' },
      { name: 'Player2' },
      { name: 'Player3' },
      { name: 'Player4' }
    ],
    state: GameState.PLAYING,
    isRevolution: false
  },
  player: {
    id: 1,
    cards: []
  },
  playerIndex: 0
});

describe('Game reducer', () => {
  it('gameStarted', () => {
    const initialState = gameReducer(undefined, { type: '' });
    const data = getGameData();

    const reducer = gameReducer(initialState, gameStarted(data));
    expect(reducer.gameId).to.equal(1);
    expect(reducer.playerCount).to.equal(4);
    expect(reducer.playerId).to.equal(1);
    expect(reducer.playerIndex).to.equal(0);
    expect(reducer.gameState).to.equal(GameState.PLAYING);
    expect(reducer.otherPlayers.length).to.equal(3);
    expect(reducer.otherPlayers.find(player => player.name === 'Player1')).to.equal(undefined);
    expect(reducer.isRevolution).to.equal(false);
  });

  it('joinedPlayersChanged', () => {
    const initialState = gameReducer(undefined, { type: '' });
    const data = getGameData();
    data.game.players.splice(2, 2);
    data.playerIndex = 1;

    let reducer = gameReducer(initialState, gameStarted(data));
    expect(reducer.otherPlayers.length).to.equal(1);
    data.game.players.push({ name: 'Player3' });
    reducer = gameReducer(reducer, joinedPlayersChanged(data));
    expect(reducer.otherPlayers.length).to.equal(2);
    expect(reducer.otherPlayers[0].name).to.equal('Player3');
    expect(reducer.otherPlayers[1].name).to.equal('Player1');
    data.game.players.push({ name: 'Player4' });
    reducer = gameReducer(reducer, joinedPlayersChanged(data));
    expect(reducer.otherPlayers.length).to.equal(3);
    expect(reducer.otherPlayers[0].name).to.equal('Player3');
    expect(reducer.otherPlayers[1].name).to.equal('Player4');
    expect(reducer.otherPlayers[2].name).to.equal('Player1');
  });

  it('gameUpdated', () => {
    const initialState = gameReducer(undefined, { type: '' });
    const data = getGameData();
    let turnData = { ...data };
    turnData.game.isRevolution = true;

    let reducer = gameReducer(initialState, gameStarted(data));
    reducer = gameReducer(reducer, gameUpdated(turnData));
    expect(reducer.isRevolution).to.equal(true);
  });

  it('gameEnded', () => {
    const initialState = gameReducer(undefined, { type: '' });
    const data = {
      results: [
        { name: 'Player1' },
        { name: 'Player2' }
      ]
    };

    const reducer = gameReducer(initialState, gameEnded(data));
    expect(reducer.results.length).to.equal(2);
  });

  it('newRoundStarted', () => {
    const initialState = gameReducer(undefined, { type: '' });
    const data = getGameData();

    let reducer = gameReducer(initialState, gameStarted(data));
    reducer.cardExchange = {};
    reducer = gameReducer(reducer, newRoundStarted(data));
    expect(reducer.cardExchange).to.be.null; // eslint-disable-line no-unused-expressions
  });
});
