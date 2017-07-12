import { createAction } from 'redux-actions';

export const initialize = createAction('INITIALIZE_USERNAME_INPUT');
export const setInitial = createAction('SET_INITIAL_USERNAME');
export const usernameInputChanged = createAction('USERNAME_INPUT_CHANGED');
