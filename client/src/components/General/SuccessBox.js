import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import './style.css';

const SuccessBox = ({ header, text, linkText, link }) => (
  <Row className="Success-box">
    <Col xs={3} className="Left-column">
      <img src="/images/ok.png" alt="Ok" />
    </Col>
    <Col xs={9} className="Right-column">
      <h4>{header}</h4>
      <p>{text}<Link to={link}>{linkText}</Link>.</p>
    </Col>
  </Row>
);

SuccessBox.PropTypes = {
  header: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default SuccessBox;
