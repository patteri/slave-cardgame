import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import classNames from 'classnames';
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
        {this.props.showVisibilityText &&
          <FormControl.Static className="Field-additional-text">
            Required in registration process. Not visible for other users.
          </FormControl.Static>
        }
        {this.state.email !== '' && !this.state.isValid &&
          <Alert bsStyle="danger" className="input-alert">
            Invalid email address
          </Alert>
        }
        <div className={classNames({ 'has-error': this.state.email !== '' && !this.state.isValid })}>
          <FormControl
            type="email"
            value={this.state.email}
            required
            onChange={e => this.onEmailChanged(e.target.value)}
          />
        </div>
      </FormGroup>
    );
  }
}

EmailInput.defaultValues = {
  showVisibilityText: false
};

EmailInput.propTypes = {
  showVisibilityText: PropTypes.bool,
  onEmailChanged: PropTypes.func.isRequired
};

export default EmailInput;
