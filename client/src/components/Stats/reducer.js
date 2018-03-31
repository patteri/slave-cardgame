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
  [statsLoaded]: (state, action) => ({
    ...state,
    stats: action.payload
  }),
  [userStatsLoaded]: (state, action) => ({
    ...state,
    userStats: action.payload
  })
}, initialState);

export default statsReducer;
