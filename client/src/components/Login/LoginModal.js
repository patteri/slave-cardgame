import React, { Component, PropTypes } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';

class LoginModal extends Component {

  onEnter() {
    this.props.initialize();
  }

  login(e) {
    e.preventDefault();
    this.props.onLogin(this.props.onHide);
  }

  render() {
    const { show, onHide, username, password, showError, isButtonDisabled } = this.props;
    return (
      <Modal className="Slave-modal" show={show} backdrop={'static'} onEnter={() => this.onEnter()}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={e => this.login(e)}>
            {showError &&
              <FormGroup>
                <Alert bsStyle="danger" onDismiss={this.props.onHideLoginError}>
                  <p>Invalid username or password</p>
                </Alert>
              </FormGroup>
            }
            <FormGroup controlId="username">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type="text"
                value={username}
                required
                onChange={e => this.props.onUsernameChanged(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlId="playerName">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                value={password}
                required
                onChange={e => this.props.onPasswordChanged(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormGroup>
                <Button type="submit" bsStyle="success" disabled={isButtonDisabled}>Login</Button>
              </FormGroup>
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="Close-button" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

LoginModal.PropTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  showError: PropTypes.bool.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired
};

export default LoginModal;
