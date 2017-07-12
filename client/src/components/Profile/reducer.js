import { handleActions } from 'redux-actions';
import {
  passwordChanged,
  showUsernameSuccess,
  showPasswordSuccess,
  statsLoaded
} from './actions';

const initialState = {
  password: '',
  isPasswordValid: false,
  showUsernameSuccess: false,
  showPasswordSuccess: false,
  stats: {}
};


const profileReducer = handleActions({
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
