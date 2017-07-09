import React, { PropTypes } from 'react';
import { Table, Button } from 'react-bootstrap';
import formatStat from './statsHelper';
import './style.css';

const StatList = ({ header, stats, isPercent, showDetails, onShowPlayerStats }) => (
  <div className="StatList">
    <h4>{header}</h4>
    <Table className="Stats-table" bordered striped>
      <tbody>
        {stats && stats.map((item, index) =>
          <tr key={index}>
            <td className="col-xs-1">
              {index + 1}.
            </td>
            <td className="col-xs-7">
              {showDetails &&
                <Button bsStyle="link" onClick={() => onShowPlayerStats(item.name)}>{item.name}</Button>
              }
              {showDetails === false &&
                <span>{item.name}</span>
              }
            </td>
            <td className="col-xs-4">
              {formatStat(item.value, isPercent)}
            </td>
          </tr>
        )}
        {(!stats || stats.length === 0) &&
          <tr>
            <td colSpan="3">No records to show.</td>
          </tr>
        }
      </tbody>
    </Table>
  </div>
);

StatList.propTypes = {
  header: PropTypes.string.isRequired,
  stats: PropTypes.array,
  isPercent: PropTypes.bool.isRequired,
  showDetails: PropTypes.bool.isRequired,
  onShowPlayerStats: PropTypes.func
};

export default StatList;
