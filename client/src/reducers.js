import { combineReducers } from 'redux-immutable';
import gameReducer from './components/Game/reducers';

export default combineReducers({
  game: gameReducer
});
