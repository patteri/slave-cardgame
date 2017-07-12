import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PlayerStats from './PlayerStats';
import './style.css';

const PlayerStatsModal = ({ show, onHide, stats }) => (
  <Modal className="Slave-modal Player-stats-modal" show={show} onHide={onHide} backdrop={'static'}>
    <Modal.Header closeButton>
      <Modal.Title><span className="glyphicon glyphicon-user title-glyphicon" /> {stats.username}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <PlayerStats stats={stats} />
    </Modal.Body>
    <Modal.Footer>
      <Button className="Close-button" onClick={onHide}>OK</Button>
    </Modal.Footer>
  </Modal>
);

PlayerStatsModal.PropTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  stats: PropTypes.object.isRequired
};

export default PlayerStatsModal;
