import React, { PropTypes } from 'react';
import { CardExchangeType } from '../../shared/constants';
import './style.css';

const getHelpTextCardPart = (exchangeType, cardCount) => {
  const cards = cardCount === 1 ? 'card' : 'cards';
  return exchangeType === CardExchangeType.FREE ? `freely chosen ${cards}` : `best ${cards}`;
};

const getHelpTextForExchange = (type, player, count) => {
  switch (type) {
    case CardExchangeType.FREE:
    case CardExchangeType.BEST:
      return (<p><strong>Give {count} </strong>{getHelpTextCardPart(type, count)} to player {player}</p>);
    case CardExchangeType.NONE:
    default:
      return <p>You don&apos;t change cards in this round</p>;
  }
};

const getHelpTextAfterExchange = (type, player, count) => {
  switch (type) {
    case CardExchangeType.FREE:
    case CardExchangeType.BEST:
      return (<p>Player {player} <strong>gave you {count} </strong>{getHelpTextCardPart(type, count)}</p>);
    case CardExchangeType.NONE:
    default:
      return <p />;
  }
};

const CardExchangeStatus = ({ cardExchange }) => (
  <div>
    {cardExchange.give && getHelpTextForExchange(cardExchange.type, cardExchange.player, cardExchange.count)}
    {!cardExchange.give && getHelpTextAfterExchange(cardExchange.type, cardExchange.player, cardExchange.count)}
  </div>
);

CardExchangeStatus.propTypes = {
  cardExchange: PropTypes.object.isRequired
};

export default CardExchangeStatus;
