import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import classNames from 'classnames';
import PlayerStatus from './PlayerStatus';
import { PlayerState } from '../../shared/constants';
import './style.css';

const OtherPlayers = ({ playerCount, players }) => (
  <Row>
    {players.map((item, index) => (
      <div className={`player-col-${playerCount}`} key={index}>
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
        <PlayerStatus status={item.hitStatus} />
      </div>
    ))}
  </Row>
);

OtherPlayers.propTypes = {
  playerCount: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired
};

export default OtherPlayers;
