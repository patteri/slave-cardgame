const _ = require('lodash');
const tokenGenerator = require('../helpers/tokenGenerator');
const Card = require('../../common/card');

class Player {

  // Parameters:
  // name: the name of the player
  constructor(name) {
    this._id = tokenGenerator.generateToken();
    this._name = name;
    this._hand = [];
    this._position = 0;
    this._cardExchangeRule = null;
    this._cardsForExchange = null;
    this._socket = null;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get hand() {
    return this._hand;
  }

  set hand(cards) {
    this._hand = cards;
  }

  get position() {
    return this._position;
  }

  set position(position) {
    this._position = position;
  }

  get cardExchangeRule() {
    return this._cardExchangeRule;
  }

  set cardExchangeRule(rule) {
    this._cardExchangeRule = rule;
  }

  get cardsForExchange() {
    return this._cardsForExchange;
  }

  set cardsForExchange(cards) {
    this._cardsForExchange = cards;
  }

  set socket(socket) {
    this._socket = socket;
  }

  playTurn(game) { // eslint-disable-line class-methods-use-this, no-unused-vars
    // Overwrite this method in subclass for specialized logic
  }

  selectCardsForExchange() { // eslint-disable-line class-methods-use-this, no-unused-vars
    // Overwrite this method in subclass for specialized logic
  }

  notifyForCardExchange(cards, fromPlayer) { // eslint-disable-line class-methods-use-this, no-unused-vars
    // Overwrite this method in subclass for specialized logic
  }

  // Validates two things:
  // 1. The player has the given cards
  // 2. Each card is given once
  hasCardsInHand(cards) {
    if (!Array.isArray(cards)) {
      return false;
    }
    if (_.intersectionWith(this._hand, cards, Card.isEqual).length !== cards.length) {
      return false;
    }
    return true;
  }

  // Removes specified cards from the hand
  // Note: doesn't validate cards.
  removeCardsFromHand(cards) {
    cards.forEach((card) => {
      _.remove(this._hand, item => Card.isEqual(card, item));
    });
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      cards: this._hand
    };
  }

  toShortJSON() {
    return {
      name: this._name
    };
  }

}

module.exports = Player;
