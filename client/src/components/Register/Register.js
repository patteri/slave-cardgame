import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, FormGroup } from 'react-bootstrap';
import UsernameInput from '../General/UsernameInput';
import PasswordInput from '../General/PasswordlInput';
import EmailInput from '../General/EmailInput';
import SuccessBox from '../General/SuccessBox';

class Register extends Component {

  componentWillMount() {
    this.props.initialize();
  }

  register(e) {
    e.preventDefault();
    this.props.onRegister();
  }

  render() {
    const { isButtonDisabled, registrationSuccessful, isValid } = this.props;
    return (
      <div className="Register">
        <h2 className="Slave-header">Register a player account</h2>
        <Row className="Register-container">
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            {!registrationSuccessful &&
              <form onSubmit={e => this.register(e)}>
                <UsernameInput controlId="" />
                <PasswordInput onPasswordChanged={this.props.onPasswordChanged} />
                <EmailInput onEmailChanged={this.props.onEmailChanged} />
                <FormGroup>
                  <FormGroup>
                    <Button type="submit" disabled={isButtonDisabled || !isValid}>Register</Button>
                  </FormGroup>
                </FormGroup>
              </form>
            }
            {registrationSuccessful &&
              <SuccessBox
                header="The registration was successful!"
                text="You may now "
                linkText="login"
                link="login"
              />
            }
          </Col>
        </Row>
      </div>
    );
  }

}

Register.PropTypes = {
  isButtonDisabled: PropTypes.bool.isRequired,
  registrationSuccessful: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired
};

export default Register;
