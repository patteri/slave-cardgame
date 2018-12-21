import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import './style.css';

const DisconnectedModal = ({ show }) => (
  <Modal className="Slave-modal Disconnected-modal" show={show} backdrop={'static'}>
    <Modal.Header>
      <Modal.Title>Connection error</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>The connection was lost. Please, check your internet connection...</p>
    </Modal.Body>
  </Modal>
);

DisconnectedModal.propTypes = {
  show: PropTypes.bool.isRequired
};

export default DisconnectedModal;
