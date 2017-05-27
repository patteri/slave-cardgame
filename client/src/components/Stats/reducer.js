import { handleActions } from 'redux-actions';
import { statsLoaded } from './actions';

const initialState = {
  stats: {}
};

const statsReducer = handleActions({
  [statsLoaded]: (state, action) => Object.assign({}, state, {
    stats: action.payload
  })
}, initialState);

export default statsReducer;
