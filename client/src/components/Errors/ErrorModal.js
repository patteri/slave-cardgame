import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { closeErrorModal } from './actions';
import './style.css';

const mapStateToProps = state => state.error;

const mapDispatchToProps = dispatch => ({
  onCloseErrorModal() {
    dispatch(closeErrorModal());
  }
});

const ErrorModal = props => (
  <Modal className="Slave-modal" show={props.show} backdrop={'static'}>
    <Modal.Header closeButton>
      <Modal.Title>Error</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{props.message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button className="Close-button" onClick={props.onCloseErrorModal}>OK</Button>
    </Modal.Footer>
  </Modal>
);

ErrorModal.PropTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorModal);
