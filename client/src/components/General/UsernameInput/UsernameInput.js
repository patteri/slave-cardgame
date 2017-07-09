import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import classNames from 'classnames';
import { GameValidation as gv } from '../../../shared/constants';
import '../style.css';

const UsernameInput = props => (
  <FormGroup controlId={props.controlId}>
    <ControlLabel>Player name</ControlLabel>
    {props.showRegistrationText &&
      <FormControl.Static className="Field-additional-text">
        Improve experience by <Link to="/register">registering</Link> your player name!
      </FormControl.Static>
    }
    {props.isReserved &&
      <Alert bsStyle="danger" className="input-alert">
        The player name is reserved
      </Alert>
    }
    <div className={classNames({ 'has-error': props.isReserved })}>
      <FormControl
        type="text"
        value={props.username}
        required
        maxLength={gv.maxUsernameLength}
        onChange={e => props.onUsernameChanged(e.target.value)}
      />
    </div>
  </FormGroup>
);

UsernameInput.defaultProps = {
  showRegistrationText: false
};

UsernameInput.PropTypes = {
  controlId: PropTypes.string.isRequired,
  showRegistrationText: PropTypes.bool,
  username: PropTypes.string.isRequired,
  isReserved: PropTypes.bool.isRequired
};

export default UsernameInput;
