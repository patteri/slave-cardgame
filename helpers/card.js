const Suits = ["SPADES", "HEARTS", "CLUBS", "DIAMONDS"];

class Card {

  // Parameters:
  // suit: value of Card.Suits
  // value: value between 1 to 13
  constructor(suit, value) {
    if (Suits.indexOf(suit) === -1) {
      throw new Error("Invalid suit");
    }
    if (!Number.isInteger(value) || value < 1 || value > 13) {
      throw new Error("Invalid value");
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
}

module.exports = Card;