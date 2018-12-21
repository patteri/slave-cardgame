import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import StatList from '../Stats/StatList';

const Leaderboard = ({ stats, ...props }) => (
  <Row className="Leaderboard">
    <Col {...props}>
      <StatList
        header="Leaderboard"
        stats={stats.averageGamePoints}
        isPercent
        showDetails={false}
      />
      <div className="Stats-link">
        <Link to="/stats">Show more</Link>
      </div>
    </Col>
  </Row>
);

Leaderboard.propTypes = {
  stats: PropTypes.object.isRequired
};

export default Leaderboard;
