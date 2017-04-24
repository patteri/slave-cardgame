import { handleActions } from 'redux-actions';
import { GameValidation as gv } from '../../../../common/constants';
import {
  playerCountChanged,
  cpuPlayerCountChanged,
  gameCountChanged,
  playerNameChanged
} from './actions';

const initialState = {
  playerCount: 4,
  cpuPlayerCount: 0,
  gameCount: 10,
  playerName: '',
  isButtonDisabled: true
};

const homeReducer = handleActions({
  [playerCountChanged]: (state, action) => {
    let number = Number.parseInt(action.payload, 10);
    let count = (number >= gv.minPlayerCount && number <= gv.maxPlayerCount) ?
      number : state.playerCount;
    let cpuCount = (state.cpuPlayerCount >= count) ? count - 1 : state.cpuPlayerCount;
    return Object.assign({}, state, {
      playerCount: count,
      cpuPlayerCount: cpuCount
    });
  },
  [cpuPlayerCountChanged]: (state, action) => {
    let number = Number.parseInt(action.payload, 10);
    let cpuCount = (number >= 0 && number <= gv.maxPlayerCount - 1 &&
      number < state.playerCount) ? number : state.cpuPlayerCount;
    return Object.assign({}, state, {
      cpuPlayerCount: cpuCount
    });
  },
  [gameCountChanged]: (state, action) => {
    let number = Number.parseInt(action.payload, 10);
    let count = (number >= gv.minGameCount && number <= gv.maxGameCount) ?
      number : state.gameCount;
    return Object.assign({}, state, {
      gameCount: count
    });
  },
  [playerNameChanged]: (state, action) => {
    let isButtonDisabled = (action.payload == null || action.payload.length < gv.minPlayerNameLength ||
      action.payload.length > gv.maxPlayerNameLength);
    return Object.assign({}, state, {
      playerName: action.payload,
      isButtonDisabled: isButtonDisabled
    });
  }
}, initialState);

export default homeReducer;
