import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

class Login extends Component {

  componentWillMount() {
    this.props.initialize();
  }

  login(e) {
    e.preventDefault();
    this.props.onLogin();
  }

  render() {
    const { username, password, showError, isButtonDisabled } = this.props;
    return (
      <div className="Login">
        <h2 className="Slave-header">Login</h2>
        <Row className="Login-container">
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            <form onSubmit={e => this.login(e)}>
              {showError &&
                <FormGroup>
                  <Alert bsStyle="danger" onDismiss={this.props.onHideLoginError}>
                    <p>Invalid player name or password</p>
                  </Alert>
                </FormGroup>
              }
              <FormGroup controlId="loginPlayername">
                <ControlLabel>Player name</ControlLabel>
                <FormControl
                  type="text"
                  value={username}
                  required
                  onChange={e => this.props.onUsernameChanged(e.target.value)}
                />
              </FormGroup>
              <FormGroup controlId="loginPassword">
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
                  <Button type="submit" disabled={isButtonDisabled}>Login</Button>
                </FormGroup>
              </FormGroup>
            </form>
            <p className="Forgot">
              Did you forget your player name or password?<br />
              <Link to="/forgot">Reset password</Link>
            </p>
          </Col>
        </Row>
      </div>
    );
  }

}

Login.PropTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  showError: PropTypes.bool.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired
};

export default Login;
