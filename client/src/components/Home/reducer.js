import { handleActions } from 'redux-actions';
import { GameValidation as gv } from '../../shared/constants';
import {
  openGamesChanged,
  playerCountChanged,
  cpuPlayerCountChanged,
  gameCountChanged,
  usernameChanged,
  statsLoaded
} from './actions';

const initialState = {
  openGames: [],
  playerCount: 4,
  cpuPlayerCount: 0,
  gameCount: 10,
  username: '',
  isValid: false,
  stats: {}
};

const homeReducer = handleActions({
  [openGamesChanged]: (state, action) => ({
    ...state,
    openGames: action.payload.games
  }),
  [playerCountChanged]: (state, action) => {
    let number = Number.parseInt(action.payload, 10);
    let count = (number >= gv.minPlayerCount && number <= gv.maxPlayerCount) ?
      number : state.playerCount;
    let cpuCount = (state.cpuPlayerCount >= count) ? count - 1 : state.cpuPlayerCount;
    return {
      ...state,
      playerCount: count,
      cpuPlayerCount: cpuCount
    };
  },
  [cpuPlayerCountChanged]: (state, action) => {
    let number = Number.parseInt(action.payload, 10);
    let cpuCount = (number >= 0 && number <= gv.maxPlayerCount - 1 &&
      number < state.playerCount) ? number : state.cpuPlayerCount;
    return {
      ...state,
      cpuPlayerCount: cpuCount
    };
  },
  [gameCountChanged]: (state, action) => {
    let number = Number.parseInt(action.payload, 10);
    let count = (number >= gv.minGameCount && number <= gv.maxGameCount) ?
      number : state.gameCount;
    return {
      ...state,
      gameCount: count
    };
  },
  [usernameChanged]: (state, action) => {
    let username = action.payload.username;
    let isValid = action.payload.isValid && username.length >= gv.minUsernameLength &&
      username.length <= gv.maxUsernameLength;
    return {
      ...state,
      username,
      isValid
    };
  },
  [statsLoaded]: (state, action) => ({
    ...state,
    stats: action.payload
  })
}, initialState);

export default homeReducer;
