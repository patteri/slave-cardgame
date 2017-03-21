import { handleActions } from 'redux-actions';
import playerReducer, { initialState as playerInitialState } from './playerReducer';
import {
  gameRequested,
  turnChanged,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  cardExchangeRequested,
  cardsExchanged,
  newRoundStarted } from '../actions';
import { CardExchangeType } from '../../../../../common/constants';

const initialState = {
  gameId: null,
  playerId: null,
  playerIndex: null,
  player: playerInitialState,
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

const getOtherPlayers = (players, playerIndex) =>
  players.filter((player, index) => index !== playerIndex);

const getHelpTextForExchange = (exchangeRule) => {
  switch (exchangeRule.exchangeType) {
    case CardExchangeType.FREE:
      return 'You give ' + exchangeRule.exchangeCount + ' freely chosen cards to player \'' +
        exchangeRule.toPlayer.name + '\'';
    case CardExchangeType.BEST:
      return 'You give ' + exchangeRule.exchangeCount + ' best card(s) to player \'' +
        exchangeRule.toPlayer.name + '\'';
    case CardExchangeType.NONE:
    default:
      return 'You don\'t change cards at this round';
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
  [gameRequested]: (state, action) => {
    let gameParameters = getGameParameters(action.payload.game);
    return Object.assign({}, state, {
      gameId: action.payload.game.id,
      playerId: action.payload.player.id,
      playerIndex: action.payload.playerIndex,
      player: playerReducer(state, action),
      otherPlayers: getOtherPlayers(action.payload.game.players, action.payload.playerIndex),
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
