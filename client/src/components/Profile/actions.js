import { createAction } from 'redux-actions';

export const passwordChanged = createAction('PROFILE_PASSWORD_CHANGED');
export const showUsernameSuccess = createAction('SHOW_USERNAME_SUCCESS');
export const showPasswordSuccess = createAction('SHOW_PASSWORD_SUCCESS');
export const statsLoaded = createAction('PROFILE_STATS_LOADED');
