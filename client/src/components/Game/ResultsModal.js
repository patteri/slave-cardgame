import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ResultsModal = ({ show, onHide, results }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Results</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {results.map((item, index) =>
        <p key={index}>{item.position}. {item.name}</p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onHide}>OK</Button>
    </Modal.Footer>
  </Modal>
);

export default ResultsModal;
