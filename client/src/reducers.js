import { combineReducers } from 'redux';
import homeReducer from './components/Home/reducer';
import joinReducer from './components/Join/reducer';
import gameReducer from './components/Game/reducers';

export default combineReducers({
  home: homeReducer,
  join: joinReducer,
  game: gameReducer
});
