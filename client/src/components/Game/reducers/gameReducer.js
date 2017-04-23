import { handleActions } from 'redux-actions';
import playerReducer from './playerReducer';
import {
  playerJoined,
  gameStarted,
  turnChanged,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  cardExchangeRequested,
  cardsGiven,
  cardsExchanged,
  newRoundStarted } from '../actions';
import { CardExchangeType } from '../../../../../common/constants';

const initialState = {
  gameId: null,
  playerCount: 0,
  playerId: null,
  playerIndex: null,
  player: playerReducer(undefined, { type: '' }),
  gameState: null,
  otherPlayers: [],
  table: [],
  isFirstTurn: true,
  isRevolution: false,
  results: [],
  helpText: null
};

const getGameParameters = game => ({
  gameState: game.state,
  table: game.previousHit,
  isFirstTurn: game.isFirstTurn,
  isRevolution: game.isRevolution
});

const getOtherPlayers = (players, playerIndex) => {
  let results = [];
  for (let i = 1; i < players.length; ++i) {
    results.push(players[(playerIndex + i) % players.length]);
  }
  return results;
};

const getHelpTextForExchange = (exchangeRule) => {
  switch (exchangeRule.exchangeType) {
    case CardExchangeType.FREE:
      return 'Give ' + exchangeRule.exchangeCount + ' freely chosen cards to player \'' +
        exchangeRule.toPlayer.name + '\'';
    case CardExchangeType.BEST:
      return 'Give ' + exchangeRule.exchangeCount + ' best card(s) to player \'' +
        exchangeRule.toPlayer.name + '\'';
    case CardExchangeType.NONE:
    default:
      return 'You don\'t change cards in this round';
  }
};

const getHelpTextAfterExchange = (exchangedCards) => {
  let text = 'Player \'' + exchangedCards.fromPlayer.name + '\' gave you ' + exchangedCards.cards.length;
  if (exchangedCards.exchangeType === CardExchangeType.FREE) {
    return text + ' freely chosen card(s)';
  }
  else if (exchangedCards.exchangeType === CardExchangeType.BEST) {
    return text + ' best card(s)';
  }
  return '';
};

const gameReducer = handleActions({
  [playerJoined]: (state, action) => Object.assign({}, state, {
    otherPlayers: getOtherPlayers(action.payload.game.players, state.playerIndex)
  }),
  [gameStarted]: (state, action) => {
    let gameParameters = getGameParameters(action.payload.game);
    let playerIndex = action.payload.playerIndex !== undefined ? action.payload.playerIndex : state.playerIndex;
    return Object.assign({}, initialState, {
      gameId: action.payload.game.id,
      playerCount: action.payload.game.playerCount,
      playerId: action.payload.player.id,
      playerIndex: playerIndex,
      player: playerReducer(state, action),
      otherPlayers: getOtherPlayers(action.payload.game.players, playerIndex),
      ...gameParameters
    });
  },
  [turnChanged]: (state, action) => {
    let gameParameters = getGameParameters(action.payload.game);
    return Object.assign({}, state, {
      player: playerReducer(state, action),
      otherPlayers: getOtherPlayers(action.payload.game.players, state.playerIndex),
      ...gameParameters
    });
  },
  [gameEnded]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action),
    results: action.payload.results
  }),
  [selectedCardsChanged]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action)
  }),
  [cardsHit]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action)
  }),
  [cardExchangeRequested]: (state, action) => {
    let gameParameters = getGameParameters(action.payload.game);
    return Object.assign({}, state, {
      player: playerReducer(state, action),
      otherPlayers: getOtherPlayers(action.payload.game.players, state.playerIndex),
      helpText: getHelpTextForExchange(action.payload.exchangeRule),
      ...gameParameters
    });
  },
  [cardsGiven]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action)
  }),
  [cardsExchanged]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action),
    helpText: getHelpTextAfterExchange(action.payload.exchangedCards)
  }),
  [newRoundStarted]: (state, action) => {
    let gameParameters = getGameParameters(action.payload.game);
    return Object.assign({}, state, {
      player: playerReducer(state, action),
      otherPlayers: getOtherPlayers(action.payload.game.players, state.playerIndex),
      helpText: null,
      ...gameParameters
    });
  }
}, initialState);

export default gameReducer;
