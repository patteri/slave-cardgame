import { createAction } from 'redux-actions';

export const openGamesChanged = createAction('OPEN_GAMES_CHANGED');
export const playerCountChanged = createAction('PLAYER_COUNT_CHANGED');
export const cpuPlayerCountChanged = createAction('CPU_PLAYER_COUNT_CHANGED');
export const gameCountChanged = createAction('GAME_COUNT_CHANGED');
export const playerNameChanged = createAction('PLAYER_NAME_CHANGED');
