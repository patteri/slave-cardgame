import { handleActions } from 'redux-actions';
import { GameValidation as gv } from '../../shared/constants';
import {
  openGamesChanged,
  playerCountChanged,
  cpuPlayerCountChanged,
  gameCountChanged,
  statsLoaded
} from './actions';

const initialState = {
  openGames: [],
  playerCount: 4,
  cpuPlayerCount: 0,
  gameCount: 10,
  stats: {}
};

const homeReducer = handleActions({
  [openGamesChanged]: (state, action) => Object.assign({}, state, {
    openGames: action.payload.games
  }),
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
  [statsLoaded]: (state, action) => Object.assign({}, state, {
    stats: action.payload
  })
}, initialState);

export default homeReducer;
