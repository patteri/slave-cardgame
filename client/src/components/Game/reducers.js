import { handleActions } from 'redux-actions';
import { gameRequested, turnChanged, selectedCardsChanged, cardsHit } from './actions';
import CardHelper from '../../../../common/cardHelper';

const initialState = {
  gameId: null,
  playerId: null,
  playerIndex: null,
  player: {
    player: null,
    cards: null,
    selectedCards: [],
    canHit: false
  },
  otherPlayers: [],
  table: [],
  isFirstTurn: true,
  isRevolution: false
};

const getOtherPlayers = (players, playerIndex) =>
  players.filter((player, index) => index !== playerIndex);

const canHit = (turn, selectedCards, table, isFirstTurn, isRevolution) =>
  turn && CardHelper.validateHit(selectedCards, table, isFirstTurn, isRevolution);

const gameReducer = handleActions({
  [gameRequested]: (state, action) => Object.assign({}, state, {
    gameId: action.payload.game.id,
    playerId: action.payload.player.id,
    playerIndex: action.payload.playerIndex,
    player: Object.assign({}, state.player, {
      player: action.payload.game.players[action.payload.playerIndex],
      cards: action.payload.player.cards.sort(CardHelper.compareCards)
    }),
    otherPlayers: getOtherPlayers(action.payload.game.players, action.payload.playerIndex),
    table: action.payload.game.previousHit,
    isFirstTurn: action.payload.game.isFirstTurn,
    isRevolution: action.payload.game.isRevolution
  }),
  [turnChanged]: (state, action) => Object.assign({}, state, {
    player: Object.assign({}, state.player, {
      player: action.payload.game.players[state.playerIndex],
      canHit: canHit(action.payload.game.players[state.playerIndex].turn, state.player.selectedCards,
        action.payload.game.previousHit, action.payload.game.isFirstTurn, action.payload.game.isRevolution)
    }),
    otherPlayers: getOtherPlayers(action.payload.game.players, state.playerIndex),
    table: action.payload.game.previousHit,
    isFirstTurn: action.payload.game.isFirstTurn,
    isRevolution: action.payload.game.isRevolution
  }),
  [selectedCardsChanged]: (state, action) => Object.assign({}, state, {
    player: Object.assign({}, state.player, {
      selectedCards: action.payload,
      canHit: canHit(state.player.player.turn, action.payload, state.table, state.isFirstTurn, state.isRevolution)
    })
  }),
  [cardsHit]: (state, action) => Object.assign({}, state, {
    player: Object.assign({}, state.player, {
      cards: action.payload.cards.sort(CardHelper.compareCards),
      selectedCards: [],
      canHit: false
    })
  })
}, initialState);

export default gameReducer;
