import React, { Component, PropTypes } from 'react';
import { Row, Col, ControlLabel, FormControl, Button, Alert } from 'react-bootstrap';
import classNames from 'classnames';
import UsernameInput from '../General/UsernameInput';
import PasswordInput from '../General/PasswordlInput';
import ConfirmModal from '../General/ConfirmModal';
import PlayerStats from '../Stats/PlayerStats';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editUsername: false,
      editPassword: false,
      showConfirmModal: false
    };

    this.toggleEditUsername = this.toggleEditUsername.bind(this);
    this.toggleEditPassword = this.toggleEditPassword.bind(this);
    this.submitUsername = this.submitUsername.bind(this);
    this.submitPassword = this.submitPassword.bind(this);
    this.removeAccount = this.removeAccount.bind(this);
    this.closeRemoveConfirm = this.closeRemoveConfirm.bind(this);
  }

  componentWillMount() {
    this.props.initialize();
  }

  toggleEditUsername() {
    this.setState({
      editUsername: !this.state.editUsername,
      editPassword: false
    });
  }

  toggleEditPassword() {
    this.setState({
      editUsername: false,
      editPassword: !this.state.editPassword
    });
  }

  submitUsername() {
    if (this.props.isUsernameValid) {
      this.props.onSubmitUsername();
      this.toggleEditUsername();
    }
  }

  submitPassword() {
    if (this.props.isPasswordValid) {
      this.props.onSubmitPassword();
      this.toggleEditPassword();
    }
  }

  removeAccount() {
    this.setState({ showConfirmModal: true });
  }

  closeRemoveConfirm(remove) {
    this.setState({ showConfirmModal: false });
    if (remove) {
      this.props.onRemoveAccount();
    }
  }

  render() {
    const { username, showUsernameSuccess, showPasswordSuccess, stats } = this.props;

    return (
      <div className="Profile">
        <ConfirmModal
          show={this.state.showConfirmModal}
          title="Remove account"
          message="Are you sure you want to permanently remove the account?"
          onClose={this.closeRemoveConfirm}
        />
        <h2 className="Slave-header">User profile</h2>
        <Row>
          <Col className="Account" md={4} sm={6} mdOffset={2}>
            <h3>Account</h3>
            {showUsernameSuccess &&
              <Row>
                <Col xs={12}>
                  <Alert className="Successful" bsStyle="success" onDismiss={this.props.onHideUsernameSuccess}>
                    <p>Player name was changed successfully!</p>
                  </Alert>
                </Col>
              </Row>
            }
            <Row>
              <Col xs={4}>
                <ControlLabel>Player name:</ControlLabel>
              </Col>
              <Col xs={6}>
                {!this.state.editUsername &&
                  <FormControl.Static>{username}</FormControl.Static>
                }
                {this.state.editUsername &&
                  <UsernameInput
                    initialValue={username}
                    showHeader={false}
                    controlId=""
                    onUsernameChanged={this.props.onUsernameChanged}
                  />
                }
              </Col>
              <Col className="Profile-actions" xs={2}>
                {!this.state.editUsername &&
                  <span
                    className="glyphicon glyphicon-edit Profile-action Edit"
                    title="Change player name"
                    onClick={this.toggleEditUsername}
                  />
                }
                {this.state.editUsername &&
                  <div>
                    <span
                      className="glyphicon glyphicon-remove Profile-action Cancel"
                      title="Cancel"
                      onClick={this.toggleEditUsername}
                    />
                    <span
                      className={classNames('glyphicon', 'glyphicon-ok', 'Profile-action', 'Ok',
                        { invalid: !this.props.isUsernameValid })}
                      title="Save"
                      onClick={this.submitUsername}
                    />
                  </div>
                }
              </Col>
            </Row>
            {showPasswordSuccess &&
              <Row>
                <Col xs={12}>
                  <Alert className="Successful" bsStyle="success" onDismiss={this.props.onHidePasswordSuccess}>
                    <p>Password was changed successfully!</p>
                  </Alert>
                </Col>
              </Row>
            }
            <Row>
              <Col xs={4}>
                <ControlLabel>Password:</ControlLabel>
              </Col>
              <Col xs={6}>
                {!this.state.editPassword &&
                  <FormControl.Static>********</FormControl.Static>
                }
                {this.state.editPassword &&
                  <PasswordInput showHeader={false} onPasswordChanged={this.props.onPasswordChanged} />
                }
              </Col>
              <Col className="Profile-actions" xs={2}>
                {!this.state.editPassword &&
                  <span
                    className="glyphicon glyphicon-edit Profile-action Edit"
                    title="Change password"
                    onClick={this.toggleEditPassword}
                  />
                }
                {this.state.editPassword &&
                  <div>
                    <span
                      className="glyphicon glyphicon-remove Profile-action Cancel"
                      title="Cancel"
                      onClick={this.toggleEditPassword}
                    />
                    <span
                      className={classNames('glyphicon', 'glyphicon-ok', 'Profile-action', 'Ok',
                        { invalid: !this.props.isPasswordValid })}
                      title="Save"
                      onClick={this.submitPassword}
                    />
                  </div>
                }
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="Remove-account">
                  <Button bsStyle="warning" onClick={this.removeAccount}>Remove account</Button>
                </div>
              </Col>
            </Row>
          </Col>
          <Col className="Statistics" md={4} sm={6}>
            <h3>Statistics</h3>
            <PlayerStats stats={stats} />
          </Col>
        </Row>
      </div>
    );
  }

}

Profile.Proptypes = {
  username: PropTypes.string.isRequired,
  isUsernameValid: PropTypes.bool.isRequired,
  isPasswordValid: PropTypes.bool.isRequired,
  showUsernameSuccess: PropTypes.bool.isRequired,
  showPasswordSuccess: PropTypes.bool.isRequired,
  stats: PropTypes.object.isRequired
};

export default Profile;
