import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import UsernameInput from '../General/UsernameInput';
import { GameValidation as gv } from '../../shared/constants';

class Register extends Component {

  componentWillMount() {
    this.props.initialize();
  }

  register(e) {
    e.preventDefault();
    this.props.onRegister();
  }

  render() {
    const { password, email, showPasswordError, showEmailError, isButtonDisabled, registrationSuccessful,
      isValid } = this.props;
    return (
      <div className="Register">
        <h2 className="Slave-header">Register a player account</h2>
        <Row className="Register-container">
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
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
                    <Button type="submit" disabled={isButtonDisabled || !isValid}>Register</Button>
                  </FormGroup>
                </FormGroup>
              </form>
            }
            {registrationSuccessful &&
              <div>
                <div className="Registration-successful">
                  <img src="/images/ok.png" alt="Ok" />
                  <div className="Text-area">
                    <h4>The registration was successful!</h4>
                    <p>You may now <Link to="login">login</Link>.</p>
                  </div>
                </div>
              </div>
            }
          </Col>
        </Row>
      </div>
    );
  }

}

Register.PropTypes = {
  password: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  showPasswordError: PropTypes.bool.isRequired,
  showEmailError: PropTypes.bool.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired,
  registrationSuccessful: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired
};

export default Register;
