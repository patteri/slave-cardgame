import React, { Component, PropTypes } from 'react';
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Root extends Component {
  render() {
    return (
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