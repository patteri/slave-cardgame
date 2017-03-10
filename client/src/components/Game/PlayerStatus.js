import React from 'react';
import './style.css';

const PlayerStatus = props => (
  <p className={'Game-status ' + props.status}>{props.status}</p>
);

export default PlayerStatus;
