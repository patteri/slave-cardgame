import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { GameValidation as gv } from '../../shared/constants';

class PasswordInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      isValid: false
    };
  }

  onPasswordChanged(password) {
    const state = {
      password: password,
      isValid: !(password == null || password.length < gv.minPasswordLength ||
      password.length > gv.maxPasswordLength)
    };
    this.setState(state);
    this.props.onPasswordChanged(state);
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Password</ControlLabel>
        {this.state.password !== '' && !this.state.isValid &&
          <Alert bsStyle="danger" className="input-alert">
            {`Password must be at least ${gv.minPasswordLength} characters long`}
          </Alert>
        }
        <FormControl
          type="password"
          value={this.state.password}
          required
          maxLength={gv.maxPasswordLength}
          onChange={e => this.onPasswordChanged(e.target.value)}
        />
      </FormGroup>
    );
  }
}

PasswordInput.PropTypes = {
  onPasswordChanged: PropTypes.func.isRequired
};

export default PasswordInput;
