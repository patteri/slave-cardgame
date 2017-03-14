import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import PlayerStatus from './PlayerStatus';
import { CardExchangeType } from '../../../../common/constants';
import './style.css';

class Player extends Component {

  constructor(props) {
    super(props);

    this.getIndexOfSelected = this.getIndexOfSelected.bind(this);
    this.getButtonText = this.getButtonText.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.hitCards = this.hitCards.bind(this);
  }

  getIndexOfSelected(card) {
    return this.props.selectedCards.indexOf(card);
  }

  getButtonText() {
    if (this.props.exchangeRule == null) {
      return this.props.selectedCards.length > 0 ? 'Hit' : 'Pass';
    }
    else if (this.props.exchangeRule.exchangeType === CardExchangeType.NONE) {
      return 'Waiting for other players';
    }
    return 'Give cards';
  }

  selectCard(card) {
    if (this.props.exchangeRule == null || this.props.exchangeRule.exchangeType === CardExchangeType.FREE) {
      let selectedCards = this.props.selectedCards.slice();
      let index = this.getIndexOfSelected(card);
      if (index === -1) {
        if (this.props.exchangeRule == null && selectedCards.length > 0 && selectedCards[0].value !== card.value) {
          selectedCards = [];
        }
        selectedCards.push(card);
      }
      else {
        selectedCards.splice(index, 1);
      }
      this.props.onCardsChange(selectedCards);
    }
  }

  hitCards() {
    this.props.onHit(this.props.selectedCards);
  }

  render() {
    const { player, cards, canHit } = this.props;

    return (
      <div>
        <h2 className={classNames('Game-player-name', { turn: player.turn })}>
          {player.name}
        </h2>
        <PlayerStatus status={player.status} />
        <Button className="Game-hit-button" onClick={() => this.hitCards()} disabled={!canHit}>
          {this.getButtonText()}
        </Button>
        <div>
          {cards.map((item, index) => (
            <Button
              className={classNames('Game-card', { selected: this.getIndexOfSelected(item) !== -1 })}
              key={index} onClick={() => this.selectCard(item)}
            >
              {item.suit} {item.value}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}

export default Player;
