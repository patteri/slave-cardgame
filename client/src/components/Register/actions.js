import { createAction } from 'redux-actions';

export const initialize = createAction('INITIALIZE_REGISTER_FORM');
export const passwordChanged = createAction('REGISTER_PASSWORD_CHANGED');
export const emailChanged = createAction('REGISTER_EMAIL_CHANGED');
export const registrationSuccessful = createAction('REGISTRATION_SUCCESSFUL');
