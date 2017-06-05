import React, { Component, PropTypes } from 'react';
import { Grid, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import RegisterModal from '../Register';
import LoginModal from '../Login';
import ErrorModal from '../Errors/ErrorModal';

class Root extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showRegisterModal: false,
      showLoginModal: false
    };

    this.showRegisterModal = this.showRegisterModal.bind(this);
    this.hideRegisterModal = this.hideRegisterModal.bind(this);
    this.showLoginModal = this.showLoginModal.bind(this);
    this.hideLoginModal = this.hideLoginModal.bind(this);
  }

  showRegisterModal() {
    this.setState({
      showRegisterModal: true
    });
  }

  hideRegisterModal() {
    this.setState({
      showRegisterModal: false
    });
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
              <img src="/images/brand.png" alt="Brand" />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/home">
                <NavItem eventKey="1">Play</NavItem>
              </LinkContainer>
              <LinkContainer to="/stats">
                <NavItem eventKey="2">Stats</NavItem>
              </LinkContainer>
              <LinkContainer to="/rules">
                <NavItem eventKey="3">Rules</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              {this.props.username == null &&
                <NavItem eventKey="4" onClick={this.showRegisterModal}>
                  <span className="glyphicon glyphicon-pencil menu-glyphicon" />
                  <span>Register</span>
                </NavItem>
              }
              {this.props.username &&
                <NavDropdown eventKey="5" title={this.props.username} id="nav-dropdown">
                  <MenuItem eventKey="5.1" onClick={this.props.onLogout}>
                    <span className="glyphicon glyphicon-log-in menu-glyphicon" />
                    <span>Logout</span>
                  </MenuItem>
                </NavDropdown>
              }
              {this.props.username == null &&
                <NavItem eventKey="6" onClick={this.showLoginModal}>
                  <span className="glyphicon glyphicon-log-in menu-glyphicon" />
                  <span>Login</span>
                </NavItem>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Grid className="fill">
          <ErrorModal />
          <RegisterModal show={this.state.showRegisterModal} onHide={this.hideRegisterModal} />
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
