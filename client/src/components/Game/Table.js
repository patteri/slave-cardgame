import React from 'react';
import { Button } from 'react-bootstrap';
import './style.css';

const Table = props => (
  <div className="Game-table">
    {props.table.map((item, index) => (
      <Button className="Game-card" key={index}>{item.suit} {item.value}</Button>
    ))}
  </div>
);

export default Table;
