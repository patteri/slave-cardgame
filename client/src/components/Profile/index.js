import { connect } from 'react-redux';
import Profile from './Profile';
import {
  passwordChanged,
  showUsernameSuccess,
  showPasswordSuccess,
  statsLoaded
} from './actions';
import { setInitial } from '../General/UsernameInput/actions';
import {
  login,
  logout
} from '../Login/actions';
import { openErrorModal } from '../Errors/actions';
import api from '../../api/api';
import './style.css';

const mapStateToProps = state => Object.assign({},
  state.profile,
  state.username);

const mapDispatchToProps = dispatch => ({
  initialize() {
    dispatch((dispatch, getState) => {
      const username = getState().auth.username;
      dispatch(setInitial(username));
      api.stats.getByUsername(username).then((response) => {
        dispatch(statsLoaded(response.data));
      }).catch(() => {
        dispatch(openErrorModal('An unknown error occurred.'));
      });
    });
  },
  onPasswordChanged(value) {
    dispatch(passwordChanged(value));
  },
  onSubmitUsername() {
    dispatch((dispatch, getState) => {
      const props = getState().username;
      api.auth.changeUsername({ username: props.username }).then((response) => {
        dispatch(login({ username: props.username, token: response.data.token, expires: response.data.expires }));
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
