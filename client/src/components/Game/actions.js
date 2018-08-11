import { createAction } from 'redux-actions';

export const joinedPlayersChanged = createAction('JOINED_PLAYERS_CHANGED');
export const gameStarted = createAction('GAME_STARTED');
export const gameUpdated = createAction('GAME_UPDATED');
export const gameEnded = createAction('GAME_ENDED');
export const selectedCardsChanged = createAction('SELECTED_CARDS_CHANGED');
export const cardsHit = createAction('CARDS_HIT');
export const toggleResultsModal = createAction('TOGGLE_RESULTS_MODAL');
export const cardExchangeRequested = createAction('CARD_EXCHANGE_REQUESTED');
export const cardsGiven = createAction('CARDS_GIVEN');
export const cardsExchanged = createAction('CARDS_EXCHANGED');
export const newRoundStarted = createAction('NEW_ROUND_STARTED');
export const gameFinished = createAction('GAME_FINISHED');
export const requestStarted = createAction('REQEUST_STARTED');
export const requestEnded = createAction('REQEUST_ENDED');
