const Suits = { CLUBS: 'Clubs', DIAMONDS: 'Diamonds', HEARTS: 'Hearts', SPADES: 'Spades' };

class Card {

  // Parameters:
  // suit: value of Card.Suits
  // value: value between 1 to 13
  constructor(suit, value) {
    if (suit == null || !Suits.hasOwnProperty(suit.toUpperCase())) {
      throw new Error('Invalid suit');
    }
    if (!Number.isInteger(value) || value < 1 || value > 13) {
      throw new Error('Invalid value');
    }

    this._suit = suit;
    this._value = value;
  }

  get suit() {
    return this._suit;
  }

  get value() {
    return this._value;
  }

  static get Suits() {
    return Suits;
  }

  // The function can be used for sorting the deck
  // The function assumes that Ace (value = 1) is the greatest card.
  static compare(first, second) {
    if (first.value === second.value) {
      return first.suit.localeCompare(second.suit);
    }
    if (first.value === 1) {
      return 1;
    }
    else if (second.value === 1) {
      return -1;
    }
    return first.value - second.value;
  }

  toJSON() {
    return {
      suit: this._suit,
      value: this._value
    };
  }
}

module.exports = Card;
