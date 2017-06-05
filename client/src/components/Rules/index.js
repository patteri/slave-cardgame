import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './style.css';

const Rules = () => (
  <div className="Rules">
    <h2 className="Slave-header">Game rules</h2>
    <Row>
      <Col md={8} mdOffset={2}>
        <p>The game is played by <a href="http://tietoteekkarikilta.fi/" target="_blank" rel="noopener noreferrer">
          TiTe</a> 2005 rules.</p>
        <h3>Objective</h3>
        <p>The game objective is to get rid of cards ASAP. Players are given points according to rank.
          The one having most points in the end is the ultimate King. The last one is a Slave.</p>
        <h3>Game progress</h3>
        <ol>
          <li>When a round starts the hit turn changes clockwise.</li>
          <li>Two of clubs starts the game.</li>
          <li>As many cards as wanted with same rank can be hit on one turn.</li>
          <li>On top of previous hit a player must hit at least as many cards and with higher rank (if no revolution).
          </li>
          <li>Ace is always the best card.</li>
          <li>A player can refuse hitting and skip turn unless there is an empty table or they are starting the game.
          </li>
          <li>If a player has no valid cards to hit he must skip turn.</li>
          <li>If everybody skips turn the table is emptied.</li>
          <li>If a player hits four cards on one turn, revolution starts. In revolution, the hitting order is
            reversed to counter-clockwise and the card rank order is reversed (ace still being the best card).</li>
          <li>Hitting four cards again cancels the revolution.</li>
        </ol>
        <h3>Card exchange</h3>
        <p>After each game players change cards with each other.</p>
        <ol>
          <li>The winner chooses freely two cards that are given to the loser.</li>
          <li>The second best chooses freely one card that is given to the second last.</li>
          <li>The second last gives their best card to the second best.</li>
          <li>The last gives two best cards to the winner.</li>
        </ol>
      </Col>
    </Row>
  </div>
);

export default Rules;
