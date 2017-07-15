import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import _ from 'lodash';
import classNames from 'classnames';
import { GameValidation as gv } from '../../shared/constants';
import api from '../../api/api';
import store from '../../store';
import { openErrorModal } from '../Errors/actions';
import './style.css';

class UsernameInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: props.initialValue ? props.initialValue : '',
      isValid: false,
      isReserved: false
    };

    this.queryUsernameAvailable = _.debounce(this.queryUsernameAvailable, 750);
  }

  onUsernameChanged(username) {
    const state = {
      username: username,
      isValid: false,
      isReserved: false
    };
    this.setState(state);
    this.props.onUsernameChanged(state);

    if (username != null && username.length >= gv.minUsernameLength && username.length <= gv.maxUsernameLength) {
      this.queryUsernameAvailable(username);
    }
  }

  queryUsernameAvailable(username) {
    api.auth.usernameAvailable(username).then((response) => {
      const state = {
        username: username,
        isValid: response.data.available,
        isReserved: !response.data.available
      };
      this.setState(state);
      this.props.onUsernameChanged(state);
    }).catch(() => {
      store.dispatch(openErrorModal('An unknown error occurred.'));
    });
  }

  render() {
    const { controlId, showHeader, showRegistrationText } = this.props;

    return (
      <FormGroup controlId={controlId}>
        {showHeader &&
          <ControlLabel>Player name</ControlLabel>
        }
        {showRegistrationText &&
          <FormControl.Static className="Field-additional-text">
            Improve experience by <Link to="/register">registering</Link> your player name!
          </FormControl.Static>
        }
        {this.state.isReserved &&
          <Alert bsStyle="danger" className="input-alert">
            The player name is reserved
          </Alert>
        }
        <div className={classNames({ 'has-error': this.state.isReserved })}>
          <FormControl
            type="text"
            value={this.state.username}
            required
            maxLength={gv.maxUsernameLength}
            onChange={e => this.onUsernameChanged(e.target.value)}
          />
        </div>
      </FormGroup>
    );
  }

}

UsernameInput.defaultProps = {
  showHeader: true,
  showRegistrationText: false
};

UsernameInput.PropTypes = {
  initialValue: PropTypes.string,
  controlId: PropTypes.string.isRequired,
  showHeader: PropTypes.bool,
  showRegistrationText: PropTypes.bool,
  onUsernameChanged: PropTypes.func.isRequired
};

export default UsernameInput;
