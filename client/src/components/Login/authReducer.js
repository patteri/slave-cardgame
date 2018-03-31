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
  [login]: (state, action) => ({
    ...state,
    username: action.payload.username,
    token: action.payload.token,
    expires: action.payload.expires
  }),
  [logout]: () => ({ ...initialState })
}, initialState);

export default authReducer;
