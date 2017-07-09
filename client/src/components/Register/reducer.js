import { handleActions } from 'redux-actions';
import {
  initialize,
  passwordChanged,
  emailChanged,
  registrationSuccessful
} from './actions';

const initialState = {
  password: '',
  isPasswordValid: false,
  email: '',
  isEmailValid: false,
  isButtonDisabled: true,
  registrationSuccessful: false
};

const isButtonDisabled = (validPassword, validEmail) => !validPassword || !validEmail;

const registerReducer = handleActions({
  [initialize]: () => initialState,
  [passwordChanged]: (state, action) => Object.assign({}, state, {
    password: action.payload.password,
    isPasswordValid: action.payload.isValid,
    isButtonDisabled: isButtonDisabled(action.payload.isValid, state.isEmailValid)
  }),
  [emailChanged]: (state, action) => Object.assign({}, state, {
    email: action.payload.email,
    isEmailValid: action.payload.isValid,
    isButtonDisabled: isButtonDisabled(state.isPasswordValid, action.payload.isValid)
  }),
  [registrationSuccessful]: state => Object.assign({}, state, {
    registrationSuccessful: true
  })
}, initialState);

export default registerReducer;
