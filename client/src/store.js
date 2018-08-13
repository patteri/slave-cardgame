import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import rootReducer from './reducers';
import { loadState, saveState } from './utils/webStorage';

const LOCAL_STORAGE_AUTOLOAD_PROPS = ['auth'];
const SESSION_STORAGE_AUTOLOAD_PROPS = ['game'];

const getStateToAutoSaveToLocalStorage = state => ({
  auth: state.auth,
});

const getStateToAutoSaveToSessionStorage = state => ({
  game: state.game
});

const getStateToAutoLoad = (state, props) => state ? _.pick(state, props) : undefined;

const persistedState = Object.assign(
  getStateToAutoLoad(loadState(localStorage, 'autoSave'), LOCAL_STORAGE_AUTOLOAD_PROPS) || {},
  getStateToAutoLoad(loadState(sessionStorage, 'autoSave'), SESSION_STORAGE_AUTOLOAD_PROPS) || {}
);

// Check token expiration
if (persistedState.auth && persistedState.auth.expires && persistedState.auth.expires < Date.now()) {
  delete persistedState.auth;
}

const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(thunkMiddleware)
);

store.subscribe(_.throttle(() => { // Save state at most every 500 milliseconds
  saveState(localStorage, 'autoSave', getStateToAutoSaveToLocalStorage(store.getState()));
  saveState(sessionStorage, 'autoSave', getStateToAutoSaveToSessionStorage(store.getState()));
}, 500));

export default store;
