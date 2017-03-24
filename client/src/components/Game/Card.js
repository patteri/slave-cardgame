import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './style.css';

const getImageSrc = card => '/images/cards/' + card.suit.toLowerCase() + '-' + card.value + '-150.png';

const Card = ({ card, selected, onClick }) => (
  <input
    type="image"
    className={classNames('Game-card', { selected: selected })}
    src={getImageSrc(card)}
    onClick={onClick}
  />
);

Card.propTypes = {
  card: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Card;
