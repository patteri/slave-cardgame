import React, { PropTypes } from 'react';
import { Table, Button } from 'react-bootstrap';
import formatStat from './statsHelper';
import './style.css';

const StatList = ({ header, stats, isPercent, onShowPlayerStats }) => (
  <div className="StatList">
    <h4>{header}</h4>
    <Table className="Stats-table" bordered striped>
      <tbody>
        {stats && stats.map((item, index) =>
          <tr key={index}>
            <td className="col-xs-8">
              <Button bsStyle="link" onClick={() => onShowPlayerStats(item.name)}>{item.name}</Button>
            </td>
            <td className="col-xs-4">
              {formatStat(item.value, isPercent)}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
);

StatList.propTypes = {
  header: PropTypes.string.isRequired,
  stats: PropTypes.array,
  isPercent: PropTypes.bool.isRequired,
  onShowPlayerStats: PropTypes.func.isRequired
};

export default StatList;
