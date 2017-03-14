const Player = require('./player');
const CardHelper = require('../../common/cardHelper');
const { CardExchangeType } = require('../../common/constants');
const _ = require('lodash');

const AIInterval = 1500;

class CpuPlayer extends Player {

  playTurn(game) {
    setTimeout((game) => {
      game.playTurn(this.getNextCardsToPlay(game.previousHit.cards, game.isRevolution()));
    }, AIInterval, game);
  }

  getNextCardsToPlay(previousHit, isRevolution) {
    let cardsToPlay = [];

    if (previousHit.length === 0 || previousHit[0].value !== 1) {
      let cards = this.hand.slice().sort(CardHelper.compareCards);
      // Group cards by value in alphabetical order (values < 10 are presented in a form '0x')
      let cardGroups = _.groupBy(cards, (card) => {
        if (card.value === 1 && !isRevolution) {
          return '14';
        }
        else if (card.value < 10) {
          return '0' + card.value;
        }
        return card.value;
      });

      let previousValue = previousHit.length > 0 ? previousHit[0].value : null;
      let cardKeys = Object.keys(cardGroups).sort();
      if (isRevolution) {
        cardKeys.reverse();
      }
      for (let value of cardKeys) { // eslint-disable-line no-restricted-syntax
        let currentCards = cardGroups[value];
        let currentValue = currentCards[0].value;
        if (previousValue == null ||
          (currentCards.length >= previousHit.length &&
          (!CardHelper.compareGreatness(previousValue, currentValue, isRevolution) || currentValue === 1))) {
          cardsToPlay = currentCards;
          break;
        }
      }
    }

    return cardsToPlay;
  }

  selectCardsForExchange() {
    let cards = [];
    switch (this.cardExchangeRule.exchangeType) {
      case CardExchangeType.FREE:
        cards = _.take(this.hand.sort(CardHelper.compareCards), this.cardExchangeRule.exchangeCount);
        break;
      case CardExchangeType.BEST:
        cards = _.takeRight(this.hand.sort(CardHelper.compareCards), this.cardExchangeRule.exchangeCount);
        break;
      case CardExchangeType.NONE:
      default:
        break;
    }
    return cards;
  }

  toShortJSON() {
    return {
      name: this._name,
      isCpu: true
    };
  }

}

module.exports = CpuPlayer;
