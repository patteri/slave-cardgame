import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, ControlLabel, Table } from 'react-bootstrap';
import './style.css';

const formatPlayerName = player => player.name + (player.isCpu ? ' (CPU)' : '');

const ResultsModal = ({ show, onHide, results }) => (
  <Modal className="Slave-modal Results-modal" show={show} onHide={onHide} backdrop={'static'}>
    <Modal.Header closeButton>
      <Modal.Title>{results.gameNumber === results.totalGameCount ? 'Final results' : 'Results'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ControlLabel>Previous game:</ControlLabel>
      <Table bordered>
        <thead>
          <tr>
            <th />
            <th>Player</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {results.currentResults.map((item, index) => (
            <tr key={index}>
              <td>{item.position}.</td>
              <td>{formatPlayerName(item)}</td>
              <td>{item.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ControlLabel>Overall points after game {results.gameNumber}/{results.totalGameCount}:</ControlLabel>
      <Table bordered>
        <thead>
          <tr>
            <th />
            <th>Player</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {results.overallResults.map((item, index) =>
            <tr key={index}>
              <td>{item.position}.</td>
              <td>{formatPlayerName(item)}</td>
              <td>{item.points}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Modal.Body>
    <Modal.Footer>
      <Button className="Close-button" onClick={onHide}>OK</Button>
    </Modal.Footer>
  </Modal>
);

ResultsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  results: PropTypes.object
};

export default ResultsModal;
