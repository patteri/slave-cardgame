import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import classNames from 'classnames';
import { GameValidation as gv } from '../../../shared/constants';

const UsernameInput = props => (
  <FormGroup controlId="playerName">
    <ControlLabel>Player name</ControlLabel>
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

UsernameInput.PropTypes = {
  username: PropTypes.string.isRequired,
  isReserved: PropTypes.bool.isRequired
};

export default UsernameInput;
