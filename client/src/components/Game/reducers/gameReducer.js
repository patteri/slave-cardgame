import { handleActions } from 'redux-actions';
import playerReducer from './playerReducer';
import {
  joinedPlayersChanged,
  gameStarted,
  gameUpdated,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  toggleResultsModal,
  cardExchangeRequested,
  cardsGiven,
  cardsExchanged,
  newRoundStarted,
  gameFinished } from '../actions';
import { CardExchangeType } from '../../../shared/constants';

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
  showResultsModal: false,
  results: null,
  cardExchange: null
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

const getCardExhangeData = (exchangeRule, exchangedCards) => {
  const data = {
    give: exchangeRule != null,
    type: exchangeRule ? exchangeRule.exchangeType : exchangedCards.exchangeType
  };
  if (data.type === CardExchangeType.FREE || data.type === CardExchangeType.BEST) {
    data.player = exchangeRule ? exchangeRule.toPlayer.name : exchangedCards.fromPlayer.name;
    data.count = exchangeRule ? exchangeRule.exchangeCount : exchangedCards.cards.length;
  }
  return data;
};

const gameReducer = handleActions({
  [joinedPlayersChanged]: (state, action) => {
    let playerIndex = action.payload.playerIndex !== undefined ? action.payload.playerIndex : state.playerIndex;
    return Object.assign({}, state, {
      playerIndex: playerIndex,
      otherPlayers: getOtherPlayers(action.payload.game.players, playerIndex)
    });
  },
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
  [gameUpdated]: (state, action) => {
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
  [toggleResultsModal]: (state, action) => Object.assign({}, state, {
    showResultsModal: action.payload
  }),
  [cardExchangeRequested]: (state, action) => {
    let gameParameters = getGameParameters(action.payload.game);
    return Object.assign({}, state, {
      player: playerReducer(state, action),
      otherPlayers: getOtherPlayers(action.payload.game.players, state.playerIndex),
      cardExchange: getCardExhangeData(action.payload.exchangeRule),
      ...gameParameters
    });
  },
  [cardsGiven]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action)
  }),
  [cardsExchanged]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action),
    cardExchange: getCardExhangeData(null, action.payload.exchangedCards)
  }),
  [newRoundStarted]: (state, action) => {
    let gameParameters = getGameParameters(action.payload.game);
    return Object.assign({}, state, {
      player: playerReducer(state, action),
      otherPlayers: getOtherPlayers(action.payload.game.players, state.playerIndex),
      cardExchange: null,
      ...gameParameters
    });
  },
  [gameFinished]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action)
  })
}, initialState);

export default gameReducer;
