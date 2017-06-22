import { handleActions } from 'redux-actions';
import {
  login,
  logout
} from './actions';

const initialState = {
  username: null,
  token: null,
  expires: null
};

const authReducer = handleActions({
  [login]: (state, action) => Object.assign({}, state, {
    username: action.payload.username,
    token: action.payload.token,
    expires: action.payload.expires
  }),
  [logout]: () => Object.assign({}, initialState)
}, initialState);

export default authReducer;
