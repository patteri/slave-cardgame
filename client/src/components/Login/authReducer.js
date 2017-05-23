import { handleActions } from 'redux-actions';
import {
  login,
  logout
} from './actions';

const initialState = {
  username: null,
  token: null
};

const authReducer = handleActions({
  [login]: (state, action) => Object.assign({}, state, {
    username: action.payload.username,
    token: action.payload.token
  }),
  [logout]: state => Object.assign({}, state, {
    username: null,
    token: null
  })
}, initialState);

export default authReducer;
