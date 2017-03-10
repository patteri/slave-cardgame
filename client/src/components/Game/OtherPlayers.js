import React from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import PlayerStatus from './PlayerStatus';
import './style.css';

const OtherPlayers = props => (
  <Row>
    {props.players.map((item, index) => (
      <Col xs={4} key={index}>
        <h2 className={classNames('Game-player-name', { turn: item.turn })}>
          {item.name} {item.isCpu && '(CPU)'}
        </h2>
        <p>Cards: {item.cardCount}</p>
        <PlayerStatus status={item.status} />
      </Col>
    ))}
  </Row>
);

export default OtherPlayers;
