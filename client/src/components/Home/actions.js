import { createAction } from 'redux-actions';

export const openGamesChanged = createAction('OPEN_GAMES_CHANGED');
export const playerCountChanged = createAction('PLAYER_COUNT_CHANGED');
export const cpuPlayerCountChanged = createAction('CPU_PLAYER_COUNT_CHANGED');
export const gameCountChanged = createAction('GAME_COUNT_CHANGED');
export const usernameChanged = createAction('HOME_USERNAME_CHANGED');
export const statsLoaded = createAction('FRONTPAGE_STATS_LOADED');
