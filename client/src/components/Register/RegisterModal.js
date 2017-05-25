import React, { Component, PropTypes } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import UsernameInput from '../General/UsernameInput';
import { GameValidation as gv } from '../../shared/constants';

class RegisterModal extends Component {

  onEnter() {
    this.props.initialize();
  }

  register(e) {
    e.preventDefault();
    this.props.onRegister();
  }

  render() {
    const { show, onHide, password, email, showPasswordError, showEmailError, isButtonDisabled, registrationSuccessful,
      isValid } = this.props;
    return (
      <Modal className="Slave-modal" show={show} backdrop={'static'} onEnter={() => this.onEnter()}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!registrationSuccessful &&
            <form onSubmit={e => this.register(e)}>
              <UsernameInput controlId="" />
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                {showPasswordError &&
                <Alert bsStyle="danger" className="input-alert">
                  {`Password must be at least ${gv.minPasswordLength} characters long`}
                </Alert>
                }
                <FormControl
                  type="password"
                  value={password}
                  required
                  maxLength={gv.maxPasswordLength}
                  onChange={e => this.props.onPasswordChanged(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Email</ControlLabel>
                {showEmailError &&
                <Alert bsStyle="danger" className="input-alert">
                  Incorrect email address
                </Alert>
                }
                <FormControl
                  type="email"
                  value={email}
                  required
                  onChange={e => this.props.onEmailChanged(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <FormGroup>
                  <Button type="submit" bsStyle="success" disabled={isButtonDisabled || !isValid}>Register</Button>
                </FormGroup>
              </FormGroup>
            </form>
          }
          {registrationSuccessful &&
            <div className="Registration-successful">
              <img src="/images/ok.png" alt="Ok" />
              <h4>The registration was successful!</h4>
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button className="Close-button" onClick={() => this.props.onClose(onHide)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

RegisterModal.PropTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  showPasswordError: PropTypes.bool.isRequired,
  showEmailError: PropTypes.bool.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired,
  registrationSuccessful: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired
};

export default RegisterModal;
