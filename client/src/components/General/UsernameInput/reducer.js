import { handleActions } from 'redux-actions';
import { GameValidation as gv } from '../../../shared/constants';
import {
  initialize,
  usernameInputChanged
} from './actions';

const initialState = {
  username: '',
  isValid: false,
  isReserved: false
};

const isValid = (validationPending, available, username) => !validationPending && available &&
  !(username == null || username.length < gv.minUsernameLength || username.length > gv.maxUsernameLength);

const usernameReducer = handleActions({
  [initialize]: () => initialState,
  [usernameInputChanged]: (state, action) => Object.assign({}, state, {
    username: action.payload.username,
    isValid: isValid(action.payload.validationPending, action.payload.available, action.payload.username),
    isReserved: !action.payload.available
  })
}, initialState);

export default usernameReducer;
