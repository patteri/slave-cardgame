import { createAction } from 'redux-actions';

export const initialize = createAction('INITIALIZE_USERNAME_INPUT');
export const usernameInputChanged = createAction('USERNAME_INPUT_CHANGED'); // eslint-disable-line import/prefer-default-export
