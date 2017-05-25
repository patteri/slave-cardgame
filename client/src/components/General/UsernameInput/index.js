import { connect } from 'react-redux';
import _ from 'lodash';
import UsernameInput from './UsernameInput';
import { usernameInputChanged } from './actions';
import { openErrorModal } from '../../Errors/actions';
import api from '../../../api/api';
import './style.css';

const mapStateToProps = state => state.username;

const queryUsernameAvailable = _.debounce((dispatch) => {
  dispatch((dispatch, getState) => {
    const name = getState().username.username;
    if (name.length > 0) {
      api.auth.usernameAvailable(name).then((response) => {
        dispatch(usernameInputChanged({
          validationPending: false,
          available: response.data.available,
          username: name }));
      }).catch(() => {
        dispatch(openErrorModal('An unknown error occurred.'));
      });
    }
    else {
      dispatch(usernameInputChanged({ validationPending: false, available: true, username: name }));
    }
  });
}, 750);

const mapDispatchToProps = dispatch => ({
  onUsernameChanged(name) {
    dispatch(usernameInputChanged({ validationPending: true, available: true, username: name }));
    queryUsernameAvailable(dispatch);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsernameInput);
