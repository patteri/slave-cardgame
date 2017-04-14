import { handleActions } from 'redux-actions';
import { GameValidation as gv } from '../../../../common/constants';
import { gameIdChanged } from './actions';
import { playerNameChanged } from '../Home/actions';

const initialState = {
  gameId: '',
  playerName: '',
  isButtonDisabled: true
};

const isButtonDisabled = (gameId, playerName) => (gameId == null || gameId.length === 0) ||
  (playerName == null || playerName.length < gv.minPlayerNameLength || playerName.length > gv.maxPlayerNameLength);

const joinReducer = handleActions({
  [gameIdChanged]: (state, action) => Object.assign({}, state, {
    gameId: action.payload,
    isButtonDisabled: isButtonDisabled(action.payload, state.playerName)
  }),
  [playerNameChanged]: (state, action) => Object.assign({}, state, {
    playerName: action.payload,
    isButtonDisabled: isButtonDisabled(state.gameId, action.payload)
  })
}, initialState);

export default joinReducer;
