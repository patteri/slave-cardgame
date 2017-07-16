import React from 'react';
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

// Use this only with CardExchangeTypes FREE and BEST
const getHelpTextCardPart = (exchangeType, cardCount) => {
  const cards = cardCount === 1 ? 'card' : 'cards';
  return exchangeType === CardExchangeType.FREE ? `freely chosen ${cards}` : `best ${cards}`;
};

const getHelpTextForExchange = (exchangeRule) => {
  switch (exchangeRule.exchangeType) {
    case CardExchangeType.FREE:
    case CardExchangeType.BEST:
      return (<p><strong>Give {exchangeRule.exchangeCount} </strong>{getHelpTextCardPart(exchangeRule.exchangeType,
        exchangeRule.exchangeCount)} to player {exchangeRule.toPlayer.name}</p>);
    case CardExchangeType.NONE:
    default:
      return <p>You don&apos;t change cards in this round</p>;
  }
};

const getHelpTextAfterExchange = (exchangedCards) => {
  switch (exchangedCards.exchangeType) {
    case CardExchangeType.FREE:
    case CardExchangeType.BEST:
      return (<p>Player {exchangedCards.fromPlayer.name} <strong>gave you {exchangedCards.cards.length} </strong>
        {getHelpTextCardPart(exchangedCards.exchangeType, exchangedCards.cards.length)}</p>);
    case CardExchangeType.NONE:
    default:
      return <p />;
  }
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
  },
  [gameFinished]: (state, action) => Object.assign({}, state, {
    player: playerReducer(state, action)
  })
}, initialState);

export default gameReducer;
