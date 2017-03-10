const tokenGenerator = require('../helpers/tokenGenerator');

class Player {

  // Parameters:
  // name: the name of the player
  constructor(name) {
    this._id = tokenGenerator.generateToken();
    this._name = name;
    this._hand = [];
    this._position = 0;
    this._socket = null;
  }

  playTurn(game) { // eslint-disable-line class-methods-use-this, no-unused-vars
    // Overwrite this method in subclass for specialized logic
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

  set socket(socket) {
    this._socket = socket;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      cards: this._hand
    };
  }
}

module.exports = Player;
