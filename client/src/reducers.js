import { combineReducers } from 'redux';
import authReducer from './components/Login/authReducer';
import loginReducer from './components/Login/loginReducer';
import registerReducer from './components/Register/reducer';
import profileReducer from './components/Profile/reducer';
import homeReducer from './components/Home/reducer';
import joinReducer from './components/Join/reducer';
import gameReducer from './components/Game/reducers';
import statsReducer from './components/Stats/reducer';
import errorReducer from './components/Errors/reducer';

export default combineReducers({
  auth: authReducer,
  login: loginReducer,
  register: registerReducer,
  profile: profileReducer,
  home: homeReducer,
  join: joinReducer,
  game: gameReducer,
  stats: statsReducer,
  error: errorReducer
});
