import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import PlayerStatus from './PlayerStatus';
import Card from './Card';
import DeckCard from '../../shared/card';
import { PlayerState, CardExchangeType } from '../../shared/constants';
import './style.css';

class Player extends Component {

  constructor(props) {
    super(props);

    this.getIndexOfSelected = this.getIndexOfSelected.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.hitCards = this.hitCards.bind(this);
  }

  getIndexOfSelected(card) {
    return this.props.selectedCards.findIndex(item => DeckCard.isEqual(item, card));
  }

  selectCard(card) {
    const props = this.props;
    // Cards can be selected only if game is running or cards are free to select for exchange
    if (props.exchangeRule == null || props.exchangeRule.exchangeType === CardExchangeType.FREE) {
      let selectedCards = props.selectedCards.slice();
      let index = this.getIndexOfSelected(card);
      if (index === -1) {
        if (props.exchangeRule == null && selectedCards.length > 0 && selectedCards[0].value !== card.value) {
          selectedCards = [];
        }
        else if (props.exchangeRule != null && selectedCards.length > props.exchangeRule.exchangeCount - 1) {
          selectedCards.splice(0, 1);
        }
        selectedCards.push(card);
      }
      else {
        selectedCards.splice(index, 1);
      }
      props.onCardsChange(selectedCards);
    }
  }

  hitCards() {
    this.props.onHit(this.props.selectedCards);
  }

  render() {
    const { player, cards, buttonText, canHit } = this.props;

    return (
      <div>
        <span
          className={classNames('Game-player-name',
            { turn: player.turn, OutOfGame: player.status === PlayerState.OUT_OF_GAME })}
        >
          {player.name}
        </span>
        <PlayerStatus status={player.hitStatus} />
        <Button className="Game-hit-button" onClick={() => this.hitCards()} disabled={!canHit}>
          {buttonText}
        </Button>
        <div className="Game-player-cards">
          {cards.map(item => (
            <Card
              key={`${item.suit}-${item.value}`} card={item} selected={this.getIndexOfSelected(item) !== -1}
              onClick={() => this.selectCard(item)}
            />
          ))}
        </div>
      </div>
    );
  }
}

Player.PropTypes = {
  player: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  buttonText: PropTypes.string.isRequired,
  canHit: PropTypes.bool.isRequired
};

export default Player;
