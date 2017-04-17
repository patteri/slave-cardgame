import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ResultsModal = ({ show, onHide, results }) => (
  <Modal className="Results-modal" show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Results</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {results.map((item, index) =>
        <p key={index}>{item.position}. {item.name} {item.isCpu && '(CPU)'}</p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onHide}>OK</Button>
    </Modal.Footer>
  </Modal>
);

ResultsModal.PropTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  results: PropTypes.array
};

export default ResultsModal;
