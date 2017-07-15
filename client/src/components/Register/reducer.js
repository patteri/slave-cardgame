import { handleActions } from 'redux-actions';
import {
  initialize,
  usernameChanged,
  passwordChanged,
  emailChanged,
  registrationSuccessful
} from './actions';

const initialState = {
  username: '',
  isUsernameValid: false,
  password: '',
  isPasswordValid: false,
  email: '',
  isEmailValid: false,
  isButtonDisabled: true,
  registrationSuccessful: false
};

const isButtonDisabled = (validUsername, validPassword, validEmail) => !validUsername || !validPassword || !validEmail;

const registerReducer = handleActions({
  [initialize]: () => initialState,
  [usernameChanged]: (state, action) => Object.assign({}, state, {
    username: action.payload.username,
    isUsernameValid: action.payload.isValid,
    isButtonDisabled: isButtonDisabled(action.payload.isValid, state.isPasswordValid, state.isEmailValid)
  }),
  [passwordChanged]: (state, action) => Object.assign({}, state, {
    password: action.payload.password,
    isPasswordValid: action.payload.isValid,
    isButtonDisabled: isButtonDisabled(state.isUsernameValid, action.payload.isValid, state.isEmailValid)
  }),
  [emailChanged]: (state, action) => Object.assign({}, state, {
    email: action.payload.email,
    isEmailValid: action.payload.isValid,
    isButtonDisabled: isButtonDisabled(state.isUsernameValid, state.isPasswordValid, action.payload.isValid)
  }),
  [registrationSuccessful]: state => Object.assign({}, state, {
    registrationSuccessful: true
  })
}, initialState);

export default registerReducer;
