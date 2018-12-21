import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Table } from 'react-bootstrap';
import formatStat from './statsHelper';
import './style.css';

const PlayerStats = ({ stats }) => (
  <div>
    <ControlLabel>Game statistics:</ControlLabel>
    <Table className="Stats-table" bordered>
      <tbody>
        <tr>
          <td className="col-xs-8">Total games played</td>
          <td className="col-xs-4">{stats.totalGames}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Success in total games</td>
          <td className="col-xs-4">{formatStat(stats.averageGamePoints, true)}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Winning percentage</td>
          <td className="col-xs-4">{formatStat(stats.totalGameWins / stats.totalGames, true)}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Losing percentage</td>
          <td className="col-xs-4">{formatStat(stats.totalGameLooses / stats.totalGames, true)}</td>
        </tr>
      </tbody>
    </Table>
    <ControlLabel>Tournament statistics:</ControlLabel>
    <Table className="Stats-table" bordered>
      <tbody>
        <tr>
          <td className="col-xs-8">Total tournaments played</td>
          <td className="col-xs-4">{stats.totalTournaments}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Success in tournaments</td>
          <td className="col-xs-4">{formatStat(stats.averageTournamentPoints, true)}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Interrupted tournaments</td>
          <td className="col-xs-4">{stats.totalInterrupts}</td>
        </tr>
      </tbody>
    </Table>
    <ControlLabel>Streaks:</ControlLabel>
    <Table className="Stats-table" bordered>
      <tbody>
        <tr>
          <td className="col-xs-8">Current winning streak</td>
          <td className="col-xs-4">{stats.currentWinningStreak}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Longest winning streak</td>
          <td className="col-xs-4">{stats.longestWinningStreak}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Current lose streak</td>
          <td className="col-xs-4">{stats.currentLooseStreak}</td>
        </tr>
        <tr>
          <td className="col-xs-8">Longest lose streak</td>
          <td className="col-xs-4">{stats.longestLooseStreak}</td>
        </tr>
      </tbody>
    </Table>
  </div>
);

PlayerStats.propTypes = {
  stats: PropTypes.object.isRequired
};

export default PlayerStats;
