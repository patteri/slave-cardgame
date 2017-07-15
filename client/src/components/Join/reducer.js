import { handleActions } from 'redux-actions';
import {
  gameIdChanged,
  usernameChanged
} from './actions';

const initialState = {
  gameId: '',
  username: '',
  isUsernameValid: false,
  isButtonDisabled: true
};

const isValid = (gameId, isUsernameValid) => gameId != null && gameId.length > 0 && isUsernameValid;

const joinReducer = handleActions({
  [gameIdChanged]: (state, action) => Object.assign({}, state, {
    gameId: action.payload,
    isButtonDisabled: !isValid(action.payload, state.isUsernameValid)
  }),
  [usernameChanged]: (state, action) => Object.assign({}, state, {
    username: action.payload.username,
    isUsernameValid: action.payload.isValid,
    isButtonDisabled: !isValid(state.gameId, action.payload.isValid)
  })
}, initialState);

export default joinReducer;
