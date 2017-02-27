import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './style.css';

const Home = () => (
  <div className="Home">
    <h2>Welcome to play Slave!</h2>
    <LinkContainer to="game">
      <Button className="Home-start">Start game</Button>
    </LinkContainer>
  </div>
);

export default Home;
