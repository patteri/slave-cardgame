import React, { PropTypes } from 'react';
import { FormControl, InputGroup, Button } from 'react-bootstrap';

const NumericSelector = ({ value, min, max, onValueChanged }) => (
  <InputGroup>
    <InputGroup.Button>
      <Button onClick={() => onValueChanged(value - 1)}>-</Button>
    </InputGroup.Button>
    <FormControl
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={e => onValueChanged(e.target.value)}
    />
    <InputGroup.Button>
      <Button onClick={() => onValueChanged(value + 1)}>+</Button>
    </InputGroup.Button>
  </InputGroup>
);

NumericSelector.PropTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onValueChanged: PropTypes.func.isRequired
};

export default NumericSelector;
