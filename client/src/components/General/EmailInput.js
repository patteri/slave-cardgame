import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import validator from 'validator';

class EmailInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isValid: false
    };
  }

  onEmailChanged(email) {
    const state = {
      email: email,
      isValid: validator.isEmail(email)
    };
    this.setState(state);
    this.props.onEmailChanged(state);
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Email</ControlLabel>
        {this.state.email !== '' && !this.state.isValid &&
          <Alert bsStyle="danger" className="input-alert">
            Incorrect email address
          </Alert>
        }
        <FormControl
          type="email"
          value={this.state.email}
          required
          onChange={e => this.onEmailChanged(e.target.value)}
        />
      </FormGroup>
    );
  }
}

EmailInput.PropTypes = {
  onEmailChanged: PropTypes.func.isRequired
};

export default EmailInput;
