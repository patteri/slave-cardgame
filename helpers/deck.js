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

    Card.Suits.forEach((suit) => {
      for (let i = 1; i < 14; ++i) {
        this._deck.push(new Card(suit, i));
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