import React, { Component } from 'react';
import { Row, Col, Button, FormGroup, Alert } from 'react-bootstrap';
import PasswordInput from '../General/PasswordlInput';
import SuccessBox from '../General/SuccessBox';
import api from '../../api/api';
import store from '../../store';
import { openErrorModal } from '../Errors/actions';

class Renew extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      isValid: false,
      renewSuccess: null
    };

    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onHideSuccessError = this.onHideSuccessError.bind(this);
  }

  onPasswordChanged(value) {
    this.setState({
      password: value.password,
      isValid: value.isValid
    });
  }

  onHideSuccessError() {
    this.setState({ renewSuccess: null });
  }

  submit(e) {
    e.preventDefault();
    api.auth.renew({ token: this.props.params.token, password: this.state.password }).then(() => {
      this.setState({ renewSuccess: true });
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        this.setState({ renewSuccess: false });
      }
      else {
        store.dispatch(openErrorModal('An unknown error occurred.'));
      }
    });
  }

  render() {
    return (
      <div className="Renew">
        <h2 className="Slave-header">Change password</h2>
        <Row>
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            {this.state.renewSuccess !== true &&
              <div>
                <p>Type the new password.</p>
                <form onSubmit={e => this.submit(e)}>
                  {this.state.renewSuccess === false &&
                    <FormGroup>
                      <Alert bsStyle="danger" onDismiss={this.onHideSuccessError}>
                        <p>Changing the password failed. The link has expired?</p>
                      </Alert>
                    </FormGroup>
                  }
                  <PasswordInput onPasswordChanged={this.onPasswordChanged} />
                  <FormGroup>
                    <FormGroup>
                      <Button type="submit" disabled={!this.state.isValid}>Change</Button>
                    </FormGroup>
                  </FormGroup>
                </form>
              </div>
            }
            {this.state.renewSuccess === true &&
              <SuccessBox
                header="The password was changed!"
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

export default Renew;
