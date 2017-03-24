import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import PlayerStatus from './PlayerStatus';
import './style.css';

const OtherPlayers = ({ players }) => (
  <Row>
    {players.map((item, index) => (
      <Col xs={4} key={index}>
        <span className={classNames('Game-player-name', { turn: item.turn })}>
          {item.name}
          {item.isCpu && <span className="Game-player-name-cpu"> (CPU)</span>}
        </span>
        <p><span className="Game-player-card-count">{item.cardCount}</span> cards</p>
        <PlayerStatus status={item.status} />
      </Col>
    ))}
  </Row>
);

OtherPlayers.propTypes = {
  players: PropTypes.array.isRequired
};

export default OtherPlayers;
