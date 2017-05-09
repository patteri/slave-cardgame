import { handleActions } from 'redux-actions';
import {
  openErrorModal,
  closeErrorModal
} from './actions';

const initialState = {
  show: false,
  message: ''
};

const errorReducer = handleActions({
  [openErrorModal]: (state, action) => Object.assign({}, state, {
    show: true,
    message: action.payload
  }),
  [closeErrorModal]: state => Object.assign({}, state, {
    show: false
  })
}, initialState);

export default errorReducer;
