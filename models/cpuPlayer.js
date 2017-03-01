const Player = require('./player');
const Card = require('./card');
const _ = require('lodash');

const AIInterval = 1500;

class CpuPlayer extends Player {

  playTurn(game) {
    setTimeout((game) => {
      game.playTurn(this.getNextCardsToPlay(game.previousHit.cards));
    }, AIInterval, game);
  }

  getNextCardsToPlay(previousHit) {
    let cardsToPlay = [];

    if (previousHit.length === 0 || previousHit[0].value !== 1) {
      let cards = this.hand.slice().sort(Card.compare);
      // Group cards by value: use symbol 'a' for ace to make it be the last group
      let cardGroups = _.groupBy(cards, card => (card.value === 1 ? 'a' : card.value));

      let previousValue = previousHit.length > 0 ? previousHit[0].value : 0;
      for (let value of Object.keys(cardGroups)) { // eslint-disable-line no-restricted-syntax
        let currentCards = cardGroups[value];
        let currentValue = currentCards[0].value;
        if (currentCards.length >= previousHit.length && (currentValue > previousValue || currentValue === 1)) {
          cardsToPlay = currentCards;
          break;
        }
      }
    }

    return cardsToPlay;
  }

}

module.exports = CpuPlayer;
