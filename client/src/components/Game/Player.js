import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import PlayerStatus from './PlayerStatus';
import CardHelper from '../../../../common/cardHelper';
import './style.css';

class Player extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCards: []
    };

    this.getIndexOfSelected = this.getIndexOfSelected.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.hitCards = this.hitCards.bind(this);
    this.canHit = this.canHit.bind(this);
  }

  getIndexOfSelected(card) {
    return this.state.selectedCards.indexOf(card);
  }

  selectCard(card) {
    let selectedCards = this.state.selectedCards.slice();
    let index = this.getIndexOfSelected(card);
    if (index === -1) {
      if (selectedCards.length > 0 && selectedCards[0].value !== card.value) {
        selectedCards = [];
      }
      selectedCards.push(card);
    }
    else {
      selectedCards.splice(index, 1);
    }
    this.setState({
      selectedCards: selectedCards
    });
  }

  hitCards() {
    this.props.onHit(this.state.selectedCards, () => {
      this.setState({
        selectedCards: []
      });
    });
  }

  canHit() {
    // Must be player's turn and valid cards selected
    let isValid = CardHelper.validateHit(this.state.selectedCards, this.props.table, this.props.isFirstTurn,
      this.props.isRevolution);
    return this.props.player.turn && isValid;
  }

  render() {
    const { selectedCards } = this.state;

    return (
      <div>
        <h2 className={classNames('Game-player-name', { turn: this.props.player.turn })}>
          {this.props.player.name}
        </h2>
        <PlayerStatus status={this.props.player.status} />
        <Button className="Game-hit-button" onClick={() => this.hitCards()} disabled={!this.canHit()}>
          {selectedCards.length > 0 ? 'Hit' : 'Pass'}
        </Button>
        <div>
          {this.props.cards.map((item, index) => (
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
