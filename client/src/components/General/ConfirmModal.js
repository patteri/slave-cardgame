import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './style.css';

const ConfirmModal = props => (
  <Modal className="Slave-modal Confirm-modal" show={props.show} backdrop={'static'}>
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{props.message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button className="Close-button" onClick={() => props.onClose(true)}>Yes</Button>
      <Button className="Close-button" onClick={() => props.onClose(false)}>No</Button>
    </Modal.Footer>
  </Modal>
);

ConfirmModal.PropTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ConfirmModal;
