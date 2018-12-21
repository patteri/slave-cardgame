import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deck from '../../utils/deck';
import './style.css';

const Card = ({ card, selected, onClick }) => (
  <input
    type="image"
    className={classNames('Game-card', { selected: selected })}
    src={deck.getCard(card).src}
    onClick={onClick}
    alt={`${card.suit}-${card.value}`}
  />
);

Card.propTypes = {
  card: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Card;
