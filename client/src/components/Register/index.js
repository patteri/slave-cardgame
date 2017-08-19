import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Register from './Register';
import {
  initialize,
  usernameChanged,
  passwordChanged,
  emailChanged,
  registrationSuccessful
} from './actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => state.register;

const mapDispatchToProps = dispatch => ({
  initialize() {
    dispatch(initialize());
  },
  onUsernameChanged(value) {
    dispatch(usernameChanged(value));
  },
  onPasswordChanged(value) {
    dispatch(passwordChanged(value));
  },
  onEmailChanged(value) {
    dispatch(emailChanged(value));
  },
  onRegister() {
    dispatch((dispatch, getState) => {
      let state = getState();
      api.auth.register({
        username: state.register.username,
        password: state.register.password,
        email: state.register.email
      }).then(() => {
        dispatch(registrationSuccessful());
      }).catch(() => {
        dispatch(openErrorModal('An unknown error occurred.'));
      });
    });
  },
  onClose() {
    browserHistory.push('/');
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
