import { handleActions } from 'redux-actions';
import validator from 'validator';
import { GameValidation as gv } from '../../shared/constants';
import {
  initialize,
  passwordChanged,
  emailChanged,
  registrationSuccessful
} from './actions';

const initialState = {
  password: '',
  email: '',
  showPasswordError: false,
  showEmailError: false,
  isButtonDisabled: true,
  registrationSuccessful: false
};

const validatePassword = password => !(password == null || password.length < gv.minPasswordLength ||
password.length > gv.maxPasswordLength);

const validateEmail = email => validator.isEmail(email);

const isButtonDisabled = (password, email) => !validatePassword(password) || !validateEmail(email);

const registerReducer = handleActions({
  [initialize]: () => initialState,
  [passwordChanged]: (state, action) => Object.assign({}, state, {
    password: action.payload,
    showPasswordError: !validatePassword(action.payload),
    isButtonDisabled: isButtonDisabled(action.payload, state.email)
  }),
  [emailChanged]: (state, action) => Object.assign({}, state, {
    email: action.payload,
    showEmailError: !validateEmail(action.payload),
    isButtonDisabled: isButtonDisabled(state.password, action.payload)
  }),
  [registrationSuccessful]: state => Object.assign({}, state, {
    registrationSuccessful: true
  })
}, initialState);

export default registerReducer;
