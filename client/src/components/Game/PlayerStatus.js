import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const PlayerStatus = ({ status }) => (
  <p className={`Player-hit-status ${status}`}>{status}</p>
);

PlayerStatus.propTypes = {
  status: PropTypes.string.isRequired
};

export default PlayerStatus;
