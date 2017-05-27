import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import './style.css';

const StatList = ({ header, stats, isPercent }) => (
  <div className="StatList">
    <h4>{header}</h4>
    <Table className="Stats-table" bordered striped>
      <tbody>
        {stats && stats.map((item, index) =>
          <tr key={index}>
            <td className="col-xs-8">{item.name}</td>
            <td className="col-xs-4">
              {isPercent ? `${(Math.round(item.value * 1000) / 10).toFixed(1)} %` : item.value}
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
  isPercent: PropTypes.bool.isRequired
};

export default StatList;
