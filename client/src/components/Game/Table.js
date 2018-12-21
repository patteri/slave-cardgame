import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import './style.css';

const Table = ({ table }) => (
  <div className="Game-table-cards">
    {table.map(item => (
      <Card key={`${item.suit}-${item.value}`} card={item} />
    ))}
  </div>
);

Table.propTypes = {
  table: PropTypes.array.isRequired
};

export default Table;
