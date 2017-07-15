import { connect } from 'react-redux';
import Profile from './Profile';
import {
  usernameChanged,
  passwordChanged,
  showUsernameSuccess,
  showPasswordSuccess,
  statsLoaded
} from './actions';
import {
  login,
  logout
} from '../Login/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => state.profile;

const mapDispatchToProps = dispatch => ({
  initialize() {
    dispatch((dispatch, getState) => {
      const username = getState().auth.username;
      dispatch(usernameChanged({ username: username, isValid: false }));
      api.stats.getByUsername(username).then((response) => {
        dispatch(statsLoaded(response.data));
      }).catch(() => {
        dispatch(openErrorModal('An unknown error occurred.'));
      });
    });
  },
  onUsernameChanged(value) {
    dispatch(usernameChanged(value));
  },
  onPasswordChanged(value) {
    dispatch(passwordChanged(value));
  },
  onSubmitUsername() {
    dispatch((dispatch, getState) => {
      const username = getState().profile.username;
      api.auth.changeUsername({ username: username }).then((response) => {
        dispatch(login({ username: username, token: response.data.token, expires: response.data.expires }));
        dispatch(showUsernameSuccess(true));
      }).catch(() => {
        dispatch(openErrorModal('An unknown error occurred.'));
      });
    });
  },
  onSubmitPassword() {
    dispatch((dispatch, getState) => {
      api.auth.renew({ password: getState().profile.password }).then(() => {
        dispatch(showPasswordSuccess(true));
      }).catch(() => {
        dispatch(openErrorModal('An unknown error occurred.'));
      });
    });
  },
  onHideUsernameSuccess() {
    dispatch(showUsernameSuccess(false));
  },
  onHidePasswordSuccess() {
    dispatch(showPasswordSuccess(false));
  },
  onRemoveAccount() {
    api.auth.remove().then(() => {
      dispatch(logout());
    }).catch(() => {
      dispatch(openErrorModal('An unknown error occurred.'));
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
