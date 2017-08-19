import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Grid, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import ErrorModal from '../Errors/ErrorModal';

const navigateHome = () => {
  browserHistory.push('/');
};

const Root = props => (
  <div className="Root">
    <Navbar collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <img src="/images/brand.png" alt="Brand" onClick={navigateHome} />
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <IndexLinkContainer to="/">
            <NavItem eventKey="1">Play</NavItem>
          </IndexLinkContainer>
          <LinkContainer to="/stats">
            <NavItem eventKey="2">Stats</NavItem>
          </LinkContainer>
          <LinkContainer to="/rules">
            <NavItem eventKey="3">Rules</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          {props.username == null &&
            <LinkContainer to="/register">
              <NavItem eventKey="4">
                <span className="glyphicon glyphicon-pencil menu-glyphicon" />
                <span>Register</span>
              </NavItem>
            </LinkContainer>
          }
          {props.username &&
            <NavDropdown eventKey="5" title={props.username} id="nav-dropdown">
              <LinkContainer to="/profile">
                <MenuItem eventKey="5.1">
                  <span className="glyphicon glyphicon-user menu-glyphicon" />
                  <span>Profile</span>
                </MenuItem>
              </LinkContainer>
              <MenuItem eventKey="5.2" onClick={props.onLogout}>
                <span className="glyphicon glyphicon-log-in menu-glyphicon" />
                <span>Logout</span>
              </MenuItem>
            </NavDropdown>
          }
          {props.username == null &&
            <LinkContainer to="/login">
              <NavItem eventKey="6">
                <span className="glyphicon glyphicon-log-in menu-glyphicon" />
                <span>Login</span>
              </NavItem>
            </LinkContainer>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Grid className="fill Content-grid">
      <ErrorModal />
      {props.children}
    </Grid>
    <footer className="footer">
      <Grid className="fill">
        <span>Improvement ideas? Bugs?</span><br />
        <span>Contact <a href="mailto:petteri.roponen@gmail.com" target="_top">petteri.roponen@gmail.com</a></span>
      </Grid>
    </footer>
  </div>
);

Root.propTypes = {
  username: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Root;
