import React, { PropTypes } from 'react';
import './style.css';

const PlayerStatus = ({ status }) => (
  <p className={'Game-status ' + status}>{status}</p>
);

PlayerStatus.PropTypes = {
  status: PropTypes.string.isRequired
};

export default PlayerStatus;
