const Player = require('./player');
const CardHelper = require('../../client/src/shared/cardHelper');
const { CardExchangeType } = require('../../client/src/shared/constants');
const _ = require('lodash');

const AIInterval = 1000;

const DefaultConfiguration = {
  aiInterval: AIInterval, // Interval used for thinking the next hit
  applyHitDecisionLogic: true, // Flag indicating whether the special hit decision logic is used
  minCardGroupCount: 4, // Minimum card group when hit decision logic is applied
  calculateAverageAfter: true, // Indicates whether the card value average is calculated excluding the cards to hit
  // Factor for scaling the hit decision probability by cards value average
  // value 12: worst possible hand => +50%, average hand => 0%, best possible hand => -50%
  avgScaleFactor: 10,
  // Factor for scaling the hit decision probability by current value of cards to hit
  // value 13: worst possible cards => -50%, average cards => 0%, best possible cards => +50%
  valueScaleFactor: 11
};

// Helper table
const CardValues = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];

class CpuPlayer extends Player {

  constructor(name, configuration = DefaultConfiguration) {
    super(name);
    this._conf = configuration;
  }

  playTurn(game) {
    setTimeout((game) => {
      game.playTurn(this.getNextCardsToPlay(
        game.previousHit.cards,
        game.isRevolution(),
        game.table)
      );
    }, this._conf.aiInterval, game);
  }

  // Returns a key representing the value
  // The key can be used for sorting values by greatness
  getKeyOfValue(value, isRevolution) {
    if (value === 1 && !isRevolution) {
      return '14';
    }
    else if (value < 10) {
      return '0' + value;
    }
    return value.toString();
  }

  // Groups the cards by value
  // Returns also keys of the card groups sorted by greatness
  groupCards(cards, isRevolution) {
    let cardsToGroup = cards.slice().sort(CardHelper.compareCards);
    let cardGroups = _.groupBy(cardsToGroup, card => this.getKeyOfValue(card.value, isRevolution));

    let cardKeys = Object.keys(cardGroups).sort();
    if (isRevolution) {
      cardKeys.reverse();
    }

    return {
      groups: cardGroups,
      keys: cardKeys
    };
  }

  // Gets the best value that is remaining in someone's hand
  getKeyOfBestRemainingValue(tableCards, isRevolution) {
    let keys = CardValues.map(value => this.getKeyOfValue(value, isRevolution)).sort();
    if (!isRevolution) {
      keys.reverse();
    }
    let groups = this.groupCards(tableCards, isRevolution);
    for (let key of keys) { // eslint-disable-line no-restricted-syntax
      let currentCards = groups.groups[key];
      if (currentCards === undefined || currentCards.length < 4) {
        return key;
      }
    }
    return null;
  }

  isValidHit(cards, previousValue, previousHit, isRevolution) {
    let currentValue = cards[0].value;
    return previousValue == null ||
      (cards.length >= previousHit.length &&
      (!CardHelper.compareGreatness(previousValue, currentValue, isRevolution) || currentValue === 1));
  }

  // Special logic for deciding whether to hit or not
  // The goal is to try to avoid spending good cards when having bad cards
  // The logic is never applied if
  // 1. having no cards to hit
  // 2. going to hit revolution
  // 3. not many cards of different sizes left (specified by 'minCardGroupCount')
  makeHitDecision(cardGroupsCount, cardsToHit, isRevolution) {
    if (cardsToHit.length > 0 && cardsToHit.length < 4 && cardGroupsCount >= this._conf.minCardGroupCount) {
      // Calculate average by average rule
      let sum = this.hand.reduce((sum, card) => sum + CardHelper.getRealValue(card, isRevolution), 0);
      let average = 0;
      if (this._conf.calculateAverageAfter) {
        let cardsToHitSum = cardsToHit.reduce((sum, card) => sum + CardHelper.getRealValue(card, isRevolution), 0);
        average = (sum - cardsToHitSum) / (this.hand.length - cardsToHit.length);
      }
      else {
        average = sum / this.hand.length;
      }

      // Calculate hitting probability by the "goodness" of the hand (value average)
      let averageFactor = !isRevolution ? (8 - average) / this._conf.avgScaleFactor :
        (average - 7) / this._conf.avgScaleFactor;

      // Calculate hitting probability by the "goodness" of the cards to hit (value)
      let realValue = CardHelper.getRealValue(cardsToHit[0], isRevolution);
      let valueFactor = !isRevolution ? realValue - 1 : 14 - realValue;
      valueFactor = (valueFactor / this._conf.valueScaleFactor) - (6.5 / this._conf.valueScaleFactor);

      // The final probability is sum of the two factors
      if (Math.random() < valueFactor + averageFactor) {
        return false;
      }
    }

    return true;
  }

  // Chooses the next cards to play
  // The computer is capable of remembering the cards that was hit to the table :)
  getNextCardsToPlay(previousHit, isRevolution, tableCards) {
    let cardsToPlay = [];

    if (previousHit.length === 0 || previousHit[0].value !== 1) {
      let groups = this.groupCards(this.hand, isRevolution);
      let previousValue = previousHit.length > 0 ? previousHit[0].value : null;

      // If the best value is in hand and only two different values left, hit the better first
      let bestValueKey = this.getKeyOfBestRemainingValue(tableCards, isRevolution);
      let hasBestValue = bestValueKey == null ? false : groups.groups[bestValueKey] !== undefined;
      if (hasBestValue && groups.keys.length === 2 &&
        this.isValidHit(groups.groups[bestValueKey], previousValue, previousHit, isRevolution)) {
        cardsToPlay = groups.groups[bestValueKey];
      }
      else {
        // Find the "smallest" valid cards
        let opponentCardCount = 52 - tableCards.length - this.hand.length;
        for (let key of groups.keys) { // eslint-disable-line no-restricted-syntax
          let currentCards = groups.groups[key];
          if (this.isValidHit(currentCards, previousValue, previousHit, isRevolution)) {
            // If opponent has only one card left, don't hit the smallest hand, if possible.
            if (cardsToPlay.length > 0) {
              // Stop iterating
              cardsToPlay = currentCards;
              break;
            }
            else {
              cardsToPlay = currentCards;
              if (opponentCardCount > 1 || cardsToPlay.length > opponentCardCount) {
                break;
              }
            }
          }
        }

        // Give best cards only the needed count, if cards with different values > 2
        if (hasBestValue && cardsToPlay.length > 0 && groups.keys.length > 2 &&
          cardsToPlay[0].value === groups.groups[bestValueKey][0].value) {
          cardsToPlay.splice(0, cardsToPlay.length - previousHit.length);
        }

        if (this._conf.applyHitDecisionLogic &&
          !this.makeHitDecision(groups.keys.length, cardsToPlay, isRevolution)) {
          cardsToPlay = [];
        }
      }
    }

    return cardsToPlay;
  }

  // Chooses cards that will be exchanged
  selectCardsForExchange() {
    let cards = [];

    switch (this.cardExchangeRule.exchangeType) {
      case CardExchangeType.FREE:
        {
          let groups = this.groupCards(this.hand, false);
          // Try to find single cards to give (other than two of clubs and smaller than 11)
          for (let key of groups.keys) { // eslint-disable-line no-restricted-syntax
            let currentCards = groups.groups[key];
            if (currentCards[0].value >= 11 || currentCards[0].value === 1) {
              break;
            }
            if (currentCards.length === 1 && CardHelper.findTwoOfClubs(currentCards) === undefined) {
              cards.push(currentCards[0]);
              if (cards.length === this.cardExchangeRule.exchangeCount) {
                break;
              }
            }
          }
          if (cards.length < this.cardExchangeRule.exchangeCount) {
            // Give smallest cards (other than two of clubs)
            for (let key of groups.keys) { // eslint-disable-line no-restricted-syntax
              let currentCards = groups.groups[key];
              for (let card of currentCards) { // eslint-disable-line no-restricted-syntax
                if (CardHelper.findTwoOfClubs([ card ]) === undefined && cards.indexOf(card) === -1) {
                  cards.push(card);
                  if (cards.length === this.cardExchangeRule.exchangeCount) {
                    break;
                  }
                }
              }
              if (cards.length === this.cardExchangeRule.exchangeCount) {
                break;
              }
            }
          }
          break;
        }
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
