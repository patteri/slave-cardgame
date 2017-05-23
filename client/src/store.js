import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import rootReducer from './reducers';
import { loadState, saveState } from './utils/webStorage';

const getStateToPersistToLocalStorage = state => ({
  auth: state.auth
});

const getStateToPersistToSessionStorage = state => ({
  game: state.game
});

const persistedState = Object.assign(loadState(localStorage) || {}, loadState(sessionStorage) || {});

const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(thunkMiddleware)
);

store.subscribe(_.throttle(() => { // Save state at most every 500 milliseconds
  saveState(localStorage, getStateToPersistToLocalStorage(store.getState()));
  saveState(sessionStorage, getStateToPersistToSessionStorage(store.getState()));
}, 500));

export default store;
