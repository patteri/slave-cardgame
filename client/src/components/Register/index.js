import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Register from './Register';
import {
  initialize,
  passwordChanged,
  emailChanged,
  registrationSuccessful
} from './actions';
import { initialize as initUsernameInput } from '../General/UsernameInput/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => Object.assign({},
  state.register,
  state.username);

const mapDispatchToProps = dispatch => ({
  initialize() {
    dispatch(initialize());
    dispatch(initUsernameInput());
  },
  onPasswordChanged(password) {
    dispatch(passwordChanged(password));
  },
  onEmailChanged(email) {
    dispatch(emailChanged(email));
  },
  onRegister() {
    dispatch((dispatch, getState) => {
      let state = getState();
      api.auth.register({
        username: state.username.username,
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
    dispatch(initUsernameInput());
    browserHistory.push('/home');
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
