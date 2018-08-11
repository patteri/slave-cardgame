import React, { Component } from 'react';
import { Row, Col, Button, FormGroup, Alert } from 'react-bootstrap';
import EmailInput from '../General/EmailInput';
import StatusBox from '../General/StatusBox';
import api from '../../api/api';
import store from '../../store';
import { openErrorModal } from '../Errors/actions';

class Forgot extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isValid: false,
      resetSuccess: null
    };
  }

  onEmailChanged = (value) => {
    this.setState({
      email: value.email,
      isValid: value.isValid
    });
  }

  onHideSuccessError = () => {
    this.setState({ resetSuccess: null });
  }

  submit = (e) => {
    e.preventDefault();
    api.auth.forgot({ email: this.state.email }).then(() => {
      this.setState({ resetSuccess: true });
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        this.setState({ resetSuccess: false });
      }
      else {
        store.dispatch(openErrorModal('An unknown error occurred.'));
      }
    });
  }

  render() {
    return (
      <div className="Forgot">
        <h2 className="Slave-header">Reset password</h2>
        <Row>
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            {this.state.resetSuccess !== true &&
              <div>
                <p>Did you forget your username or password?<br />Send a password renewal link to your email.</p>
                <form onSubmit={e => this.submit(e)}>
                  {this.state.resetSuccess === false &&
                    <FormGroup>
                      <Alert bsStyle="danger" onDismiss={this.onHideSuccessError}>
                        <p>No player account is matching the given email</p>
                      </Alert>
                    </FormGroup>
                  }
                  <EmailInput onEmailChanged={this.onEmailChanged} />
                  <FormGroup>
                    <FormGroup>
                      <Button type="submit" disabled={!this.state.isValid}>Send</Button>
                    </FormGroup>
                  </FormGroup>
                </form>
              </div>
            }
            {this.state.resetSuccess === true &&
              <StatusBox
                status="success"
                header="The password renewal email was sent!"
                text="Go to the "
                linkText="front page"
                link="/"
              />
            }
          </Col>
        </Row>
      </div>
    );
  }

}

export default Forgot;
