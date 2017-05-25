import { connect } from 'react-redux';
import LoginModal from './LoginModal';
import {
  initialize,
  usernameChanged,
  passwordChanged,
  loginSuccess,
  loginError,
  hideLoginError,
  login } from './actions';
import { initialize as initUsernameInput } from '../General/UsernameInput/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';

const mapStateToProps = state => state.login;

const mapDispatchToProps = dispatch => ({
  initialize() {
    dispatch(initialize());
  },
  onUsernameChanged(username) {
    dispatch(usernameChanged(username));
  },
  onPasswordChanged(password) {
    dispatch(passwordChanged(password));
  },
  onLogin(onClose) {
    dispatch((dispatch, getState) => {
      let state = getState().login;
      api.auth.login({
        username: state.username,
        password: state.password
      }).then((response) => {
        dispatch(loginSuccess());
        dispatch(login({ username: state.username, token: response.data.token }));
        dispatch(initUsernameInput());
        onClose();
      }).catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch(loginError());
        }
        else {
          dispatch(openErrorModal('An unknown error occurred.'));
        }
      });
    });
  },
  onHideLoginError() {
    dispatch(hideLoginError());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
