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
  [usernameChanged]: (state, action) => ({
    ...state,
    username: action.payload.username,
    isUsernameValid: action.payload.isValid
  }),
  [passwordChanged]: (state, action) => ({
    ...state,
    password: action.payload.password,
    isPasswordValid: action.payload.isValid
  }),
  [showUsernameSuccess]: (state, action) => ({
    ...state,
    showUsernameSuccess: action.payload
  }),
  [showPasswordSuccess]: (state, action) => ({
    ...state,
    showPasswordSuccess: action.payload
  }),
  [statsLoaded]: (state, action) => ({
    ...state,
    stats: action.payload
  })
}, initialState);

export default profileReducer;
