import { handleActions } from 'redux-actions';
import {
  usernameChanged,
  passwordChanged,
  showUsernameSuccess,
  showPasswordSuccess,
  statsLoaded
} from './actions';

const initialState = {
  username: '',
  isUsernameValid: false,
  password: '',
  isPasswordValid: false,
  showUsernameSuccess: false,
  showPasswordSuccess: false,
  stats: {}
};


const profileReducer = handleActions({
  [usernameChanged]: (state, action) => Object.assign({}, state, {
    username: action.payload.username,
    isUsernameValid: action.payload.isValid
  }),
  [passwordChanged]: (state, action) => Object.assign({}, state, {
    password: action.payload.password,
    isPasswordValid: action.payload.isValid
  }),
  [showUsernameSuccess]: (state, action) => Object.assign({}, state, {
    showUsernameSuccess: action.payload
  }),
  [showPasswordSuccess]: (state, action) => Object.assign({}, state, {
    showPasswordSuccess: action.payload
  }),
  [statsLoaded]: (state, action) => Object.assign({}, state, {
    stats: action.payload
  })
}, initialState);

export default profileReducer;
