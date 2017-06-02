import { handleActions } from 'redux-actions';
import {
  statsLoaded,
  userStatsLoaded
} from './actions';

const initialState = {
  stats: {},
  userStats: {}
};

const statsReducer = handleActions({
  [statsLoaded]: (state, action) => Object.assign({}, state, {
    stats: action.payload
  }),
  [userStatsLoaded]: (state, action) => Object.assign({}, state, {
    userStats: action.payload
  })
}, initialState);

export default statsReducer;
