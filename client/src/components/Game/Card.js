import React, { PropTypes } from 'react';
import classNames from 'classnames';
import deck from '../../utils/deck';
import './style.css';

const Card = ({ card, selected, onClick }) => (
  <input
    type="image"
    className={classNames('Game-card', { selected: selected })}
    src={deck.getCard(card).src}
    onClick={onClick}
  />
);

Card.propTypes = {
  card: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Card;
