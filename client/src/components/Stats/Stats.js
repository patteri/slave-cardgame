import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import StatList from './StatList';
import PlayerStatsModal from './PlayerStatsModal';

const statProperties = [
  { prop: 'averageGamePoints', header: 'Most successful in total games', isPercent: true },
  { prop: 'averageTournamentPoints', header: 'Most successful in tournaments', isPercent: true },
  { prop: 'totalGames', header: 'Most played games', isPercent: false },
  { prop: 'totalTournaments', header: 'Most played tournaments', isPercent: false },
  { prop: 'longestWinningStreak', header: 'Longest winning streak', isPercent: false },
  { prop: 'longestLooseStreak', header: 'Longest lose streak', isPercent: false }
];

class Stats extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showPlayerStats: false
    };

    this.showPlayerStatsModal = this.showPlayerStatsModal.bind(this);
    this.hidePlayerStatsModal = this.hidePlayerStatsModal.bind(this);
  }

  componentWillMount() {
    this.props.onLoad();
  }

  showPlayerStatsModal(playerName) {
    this.props.loadUserStats(playerName);
    this.setState({
      showPlayerStats: true
    });
  }

  hidePlayerStatsModal() {
    this.setState({
      showPlayerStats: false
    });
  }

  render() {
    const { stats, userStats } = this.props;

    return (
      <div className="Stats">
        <PlayerStatsModal
          show={this.state.showPlayerStats}
          onHide={this.hidePlayerStatsModal}
          stats={userStats}
        />
        <h2 className="Slave-header">Game statistics</h2>
        <Row>
          <Col xs={12}>
            <p>Register an account and make it to the top!</p>
          </Col>
        </Row>
        <Row>
          {statProperties.map(property => (
            <Col key={property.prop} md={4} sm={6}>
              <StatList
                header={property.header}
                stats={stats[property.prop]}
                isPercent={property.isPercent}
                showDetails
                onShowPlayerStats={this.showPlayerStatsModal}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

}

Stats.propTypes = {
  stats: PropTypes.object.isRequired,
  userStats: PropTypes.object.isRequired
};

export default Stats;
