import { handleActions } from 'redux-actions';
import {
  initialize,
  usernameChanged,
  passwordChanged,
  loginSuccess,
  loginError,
  hideLoginError
} from './actions';

const initialState = {
  username: '',
  password: '',
  showError: false,
  isButtonDisabled: true
};

const isButtonDisabled = (username, password) => (username == null || username.length === 0 || password == null ||
  password.length === 0);

const loginReducer = handleActions({
  [initialize]: () => initialState,
  [usernameChanged]: (state, action) => ({
    ...state,
    username: action.payload,
    isButtonDisabled: isButtonDisabled(action.payload, state.password)
  }),
  [passwordChanged]: (state, action) => ({
    ...state,
    password: action.payload,
    isButtonDisabled: isButtonDisabled(state.username, action.payload)
  }),
  [loginSuccess]: state => ({
    ...state,
    username: '',
    password: ''
  }),
  [loginError]: state => ({
    ...state,
    showError: true
  }),
  [hideLoginError]: state => ({
    ...state,
    showError: false
  })
}, initialState);

export default loginReducer;
