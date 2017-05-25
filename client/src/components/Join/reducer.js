import { handleActions } from 'redux-actions';
import { gameIdChanged } from './actions';

const initialState = {
  gameId: '',
  isButtonDisabled: true
};

const joinReducer = handleActions({
  [gameIdChanged]: (state, action) => Object.assign({}, state, {
    gameId: action.payload,
    isButtonDisabled: (action.payload == null || action.payload.length === 0)
  })
}, initialState);

export default joinReducer;
