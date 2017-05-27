import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import StatList from './StatList';

const statProperties = [
  { prop: 'averageGamePoints', header: 'Most successful in total games', isPercent: true },
  { prop: 'averageTournamentPoints', header: 'Most successful in tournaments', isPercent: true },
  { prop: 'totalGames', header: 'Most played games', isPercent: false },
  { prop: 'longestWinningStreak', header: 'Longest winning streak', isPercent: false },
  { prop: 'longestLooseStreak', header: 'Longest lose streak', isPercent: false }
];

class Stats extends Component {

  componentWillMount() {
    this.props.onLoad();
  }

  render() {
    const { stats } = this.props;

    return (
      <div className="Stats">
        <h2>Game statistics</h2>
        <Row>
          {statProperties.map(property => (
            <Col key={property.prop} md={4} sm={6}>
              <StatList header={property.header} stats={stats[property.prop]} isPercent={property.isPercent} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

}

Stats.propTypes = {
  stats: PropTypes.object.isRequired
};

export default Stats;
