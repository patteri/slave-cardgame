import React, { PropTypes } from 'react';
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Root = props => (
  <div className="Root">
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <span>Slave</span>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer to="home">
          <NavItem eventKey="1">Play</NavItem>
        </LinkContainer>
        <LinkContainer to="highscores">
          <NavItem eventKey="2">Highscores</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>

    <Grid className="fill">
      {props.children}
    </Grid>
  </div>
);

Root.propTypes = {
  children: PropTypes.node.isRequired
};

export default Root;
