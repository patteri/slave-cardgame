import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import PlayerStatus from './PlayerStatus';
import { PlayerState } from '../../../../common/constants';
import './style.css';

const OtherPlayers = ({ players }) => (
  <Row>
    {players.map((item, index) => (
      <Col xs={4} key={index}>
        <span
          className={classNames('Game-player-name',
            { turn: item.turn, OutOfGame: item.status === PlayerState.OUT_OF_GAME })}
        >
          {item.name}
          {item.isCpu && <span className="Game-player-name-cpu"> (CPU)</span>}
        </span>
        <p className={classNames('Game-player-card-count', { OutOfGame: item.status === PlayerState.OUT_OF_GAME })}>
          <span className="Game-player-card-count-number">{item.cardCount}</span> cards
        </p>
        <PlayerStatus status={item.status} />
      </Col>
    ))}
  </Row>
);

OtherPlayers.propTypes = {
  players: PropTypes.array.isRequired
};

export default OtherPlayers;
