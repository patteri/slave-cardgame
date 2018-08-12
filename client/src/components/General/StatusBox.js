import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import './style.css';

const getStatusImage = (status) => {
  switch (status) {
    case 'success':
      return 'ok.png';
    case 'error':
      return 'error.png';
    default:
      return null;
  }
};

const StatusBox = ({ status, header, text, linkText, link }) => (
  <Row className="Status-box">
    <Col xs={3} className="Left-column">
      <img src={`/images/${getStatusImage(status)}`} alt={status} />
    </Col>
    <Col xs={9} className="Right-column">
      <h4>{header}</h4>
      <p>{text}<Link to={link}>{linkText}</Link>.</p>
    </Col>
  </Row>
);

StatusBox.propTypes = {
  status: PropTypes.oneOf([ 'success', 'error' ]).isRequired,
  header: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default StatusBox;
