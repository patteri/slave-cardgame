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
  [openErrorModal]: (state, action) => ({
    ...state,
    show: true,
    message: action.payload
  }),
  [closeErrorModal]: state => ({
    ...state,
    show: false
  })
}, initialState);

export default errorReducer;
