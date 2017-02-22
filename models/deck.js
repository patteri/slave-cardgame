const _ = require('lodash');
const Card = require('./card');

class Deck {

  // Parameters:
  // shuffle: shuffle the deck when created
  constructor(shuffle = false) {
    this.initialize();

    if (shuffle) {
      this.shuffle();
    }
  }

  initialize() {
    this._deck = [];

    Object.keys(Card.Suits).forEach((suitKey) => {
      for (let i = 1; i < 14; ++i) {
        this._deck.push(new Card(Card.Suits[suitKey], i));
      }
    });
  }

  shuffle() {
    this._deck = _.shuffle(this._deck);
  }

  get deck() {
    return this._deck;
  }

}

module.exports = Deck;