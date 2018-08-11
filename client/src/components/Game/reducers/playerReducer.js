import _ from 'lodash';
import { handleActions } from 'redux-actions';
import {
  gameStarted,
  gameUpdated,
  gameEnded,
  selectedCardsChanged,
  cardsHit,
  cardExchangeRequested,
  cardsGiven,
  cardsExchanged,
  newRoundStarted,
  gameFinished,
  requestStarted,
  requestEnded } from '../actions';
import CardHelper from '../../../shared/cardHelper';
import Card from '../../../shared/card';
import { GameState, CardExchangeType } from '../../../shared/constants';

const initialState = {
  player: null,
  cards: null,
  selectedCards: [],
  buttonText: null,
  canHit: false,
  exchangeRule: null,
  cardsGiven: false,
  isRequesting: false
};

const getButtonText = (gameState, selectedCards, exchangeRule) => {
  switch (gameState) {
    case GameState.PLAYING:
      return selectedCards.length > 0 ? 'Hit' : 'Pass';
    case GameState.CARD_EXCHANGE:
      return exchangeRule && exchangeRule.exchangeType !== CardExchangeType.NONE ? 'Give cards' : 'Waiting...';
    case GameState.NOT_STARTED:
      return 'Waiting...';
    case GameState.ENDED:
      return 'Leave the game';
    default:
      return null;
  }
};

const canHit = (gameState, turn, selectedCards, table, isFirstTurn, isRevolution, exchangeRule, isRequesting) => {
  switch (gameState) {
    case GameState.PLAYING:
      return turn && !isRequesting && CardHelper.validateHit(selectedCards, table, isFirstTurn, isRevolution);
    case GameState.CARD_EXCHANGE:
      if (!isRequesting && exchangeRule && exchangeRule.exchangeType !== CardExchangeType.NONE) {
        return selectedCards.length === exchangeRule.exchangeCount;
      }
      return false;
    case GameState.NOT_STARTED:
    case GameState.ENDED:
    default:
      return false;
  }
};

const getSelectedCardsForExchange = (cards, exchangeRule) =>
  (exchangeRule.exchangeType === CardExchangeType.BEST ? _.takeRight(cards, exchangeRule.exchangeCount) : []);

const getSelectedCardsAfterExchange = (cards, cardsToSelect) =>
  _.intersectionWith(cards, cardsToSelect, Card.isEqual);

const playerReducer = handleActions({
  [gameStarted]: (state, action) => {
    let playerIndex = action.payload.playerIndex !== undefined ? action.payload.playerIndex : state.playerIndex;
    return {
      ...initialState,
      player: action.payload.game.players[playerIndex],
      cards: action.payload.player.cards.sort(CardHelper.compareCards),
      buttonText: getButtonText(action.payload.game.state, state.player.selectedCards, state.player.exchangeRule)
    };
  },
  [gameUpdated]: (state, action) => ({
    ...state.player,
    player: action.payload.game.players[state.playerIndex],
    buttonText: getButtonText(action.payload.game.state, state.player.selectedCards, state.player.exchangeRule),
    canHit: canHit(action.payload.game.state, action.payload.game.players[state.playerIndex].turn,
      state.player.selectedCards, action.payload.game.previousHit, action.payload.game.isFirstTurn,
      action.payload.game.isRevolution, state.player.exchangeRule, state.player.isRequesting)
  }),
  [gameEnded]: state => ({
    ...state.player,
    canHit: false
  }),
  [selectedCardsChanged]: (state, action) => {
    if (!state.player.cardsGiven && (state.gameState === GameState.PLAYING ||
      (state.gameState === GameState.CARD_EXCHANGE &&
      state.player.exchangeRule.exchangeType === CardExchangeType.FREE))) {
      return {
        ...state.player,
        selectedCards: action.payload,
        buttonText: getButtonText(state.gameState, action.payload, state.player.exchangeRule),
        canHit: canHit(state.gameState, state.player.player.turn, action.payload, state.table, state.isFirstTurn,
          state.isRevolution, state.player.exchangeRule, state.player.isRequesting)
      };
    }
    return state.player;
  },
  [cardsHit]: (state, action) => ({
    ...state.player,
    cards: action.payload.cards.sort(CardHelper.compareCards),
    selectedCards: [],
    buttonText: getButtonText(state.gameState, [], state.player.exchangeRule),
    canHit: false,
    isRequesting: false
  }),
  [cardExchangeRequested]: (state, action) => {
    let cards = action.payload.cards.sort(CardHelper.compareCards);
    let selectedCards = getSelectedCardsForExchange(cards, action.payload.exchangeRule);
    let cardsGiven = action.payload.exchangeRule.exchangeType === CardExchangeType.NONE;
    return {
      ...state.player,
      player: action.payload.game.players[state.playerIndex],
      cards: cards,
      selectedCards: selectedCards,
      buttonText: getButtonText(action.payload.game.state, selectedCards, action.payload.exchangeRule),
      canHit: canHit(action.payload.game.state, state.player.player.turn, selectedCards, state.table,
        state.isFirstTurn, state.isRevolution, action.payload.exchangeRule, state.player.isRequesting),
      exchangeRule: action.payload.exchangeRule,
      cardsGiven: cardsGiven
    };
  },
  [cardsGiven]: state => ({
    ...state.player,
    buttonText: 'Waiting...',
    canHit: false,
    cardsGiven: true,
    isRequesting: false
  }),
  [cardsExchanged]: (state, action) => {
    let cards = action.payload.cards.sort(CardHelper.compareCards);
    let selectedCards = getSelectedCardsAfterExchange(cards, action.payload.exchangedCards.cards);
    return ({
      ...state.player,
      cards: cards,
      selectedCards: selectedCards,
      buttonText: 'Waiting...',
      canHit: false,
      cardsGiven: true
    });
  },
  [newRoundStarted]: (state, action) => ({
    ...state.player,
    player: action.payload.game.players[state.playerIndex],
    selectedCards: [],
    buttonText: getButtonText(action.payload.game.state, [], state.player.exchangeRule),
    canHit: canHit(action.payload.game.state, action.payload.game.players[state.playerIndex].turn, [],
      action.payload.game.previousHit, action.payload.game.isFirstTurn, action.payload.game.isRevolution, null,
      state.player.isRequesting),
    exchangeRule: null,
    cardsGiven: false
  }),
  [gameFinished]: state => ({
    ...state.player,
    buttonText: getButtonText(state.gameState, [], null),
    canHit: true
  }),
  [requestStarted]: state => ({
    ...state.player,
    canHit: false,
    isRequesting: true
  }),
  [requestEnded]: state => ({
    ...state.player,
    canHit: canHit(state.gameState, state.player.player.turn, state.player.selectedCards, state.table,
      state.isFirstTurn, state.isRevolution, state.player.exchangeRule, false),
    isRequesting: false
  })
}, initialState);

export default playerReducer;
