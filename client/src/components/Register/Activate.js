import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import StatusBox from '../General/StatusBox';
import api from '../../api/api';
import store from '../../store';
import { openErrorModal } from '../Errors/actions';

class Activate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activationSuccess: null
    };
  }

  componentWillMount() {
    api.auth.activate({ access_token: this.props.params.token }).then(() => {
      this.setState({ activationSuccess: true });
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        this.setState({ activationSuccess: false });
      }
      else {
        store.dispatch(openErrorModal('An unknown error occurred.'));
      }
    });
  }

  render() {
    return (
      <div className="Activate">
        <h2 className="Slave-header">Activate account</h2>
        <Row>
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            {this.state.activationSuccess === false &&
              <StatusBox
                status="error"
                header="Activating the account failed."
                text="The link has expired? Go to the "
                linkText="front page"
                link="/home"
              />
            }
            {this.state.activationSuccess === true &&
              <StatusBox
                status="success"
                header="The account was activated!"
                text="You may now "
                linkText="login"
                link="/login"
              />
            }
          </Col>
        </Row>
      </div>
    );
  }

}

export default Activate;
