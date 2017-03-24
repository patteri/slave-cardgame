import React, { PropTypes } from 'react';
import Card from './Card';
import './style.css';

const Table = ({ table }) => (
  <div className="Game-table-cards">
    {table.map((item, index) => (
      <Card key={index} card={item} />
    ))}
  </div>
);

Table.PropTypes = {
  table: PropTypes.array.isRequired
};

export default Table;
