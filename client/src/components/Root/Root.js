import React, { Component, PropTypes } from 'react';
import { Grid, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LoginModal from '../Login';
import ErrorModal from '../Errors/ErrorModal';

class Root extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showLoginModal: false
    };

    this.showLoginModal = this.showLoginModal.bind(this);
    this.hideLoginModal = this.hideLoginModal.bind(this);
  }

  showLoginModal() {
    this.setState({
      showLoginModal: true
    });
  }

  hideLoginModal() {
    this.setState({
      showLoginModal: false
    });
  }

  render() {
    return (
      <div className="Root">
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <span>Slave</span>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/home">
                <NavItem eventKey="1">Play</NavItem>
              </LinkContainer>
              <LinkContainer to="/highscores">
                <NavItem eventKey="2">Highscores</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              {this.props.username &&
                <NavDropdown eventKey="3" title={this.props.username} id="nav-dropdown">
                  <MenuItem eventKey="3.1" onClick={this.props.onLogout}>
                    <span className="glyphicon glyphicon-log-in logging-glyphicon" />
                    <span>Logout</span>
                  </MenuItem>
                </NavDropdown>
              }
              {this.props.username == null &&
                <NavItem eventKey="4" onClick={this.showLoginModal}>
                  <span className="glyphicon glyphicon-log-in logging-glyphicon" />
                  <span>Login</span>
                </NavItem>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Grid className="fill">
          <ErrorModal />
          <LoginModal show={this.state.showLoginModal} onHide={this.hideLoginModal} />
          {this.props.children}
        </Grid>
      </div>
    );
  }
}

Root.propTypes = {
  children: PropTypes.node.isRequired
};

export default Root;
