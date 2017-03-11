import { createAction } from 'redux-actions';

export const gameRequested = createAction('GAME_REQUESTED');
export const turnChanged = createAction('TURN_CHANGED');
export const selectedCardsChanged = createAction('SELECTED_CARDS_CHANGED');
export const cardsHit = createAction('CARDS_HIT');
