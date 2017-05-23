import { createAction } from 'redux-actions';

export const initialize = createAction('INITIALIZE_LOGIN_FORM');
export const usernameChanged = createAction('USERNAME_CHANGED');
export const passwordChanged = createAction('PASSWORD_CHANGED');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginError = createAction('LOGIN_ERROR');
export const hideLoginError = createAction('HIDE_LOGIN_ERROR');

export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');
