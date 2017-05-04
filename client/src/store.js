import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import rootReducer from './reducers';
import { loadState, saveState } from './utils/localStorage';

// Only game is required to persist
const getStateToPersist = state => ({
  game: state.game
});

const configureStore = () => {
  const persistedState = loadState();

  const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(thunkMiddleware)
  );

  store.subscribe(_.throttle(() => { // Save state at most every 500 milliseconds
    saveState(getStateToPersist(store.getState()));
  }, 500));

  return store;
};

export default configureStore;
