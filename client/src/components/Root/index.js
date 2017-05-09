import React, { PropTypes } from 'react';
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ErrorModal from '../Errors/ErrorModal';

const Root = props => (
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
      </Navbar.Collapse>
    </Navbar>

    <Grid className="fill">
      <ErrorModal />
      {props.children}
    </Grid>
  </div>
);

Root.propTypes = {
  children: PropTypes.node.isRequired
};

export default Root;
