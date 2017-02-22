const tokenGenerator = require('../helpers/tokenGenerator');

const PlayerTypes = {HUMAN: "Human", CPU: "Cpu"};

class Player {

  // Parameters:
  // type: the type of the player
  // name: the name of the player
  constructor(type, name) {
    if (type == null || !PlayerTypes.hasOwnProperty(type.toUpperCase())) {
      throw new Error("Invalid player type");
    }

    this._id = tokenGenerator.generateToken();
    this._type = type;
    this._name = name;
    this._hand = [];
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
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

  static get PlayerTypes() {
    return PlayerTypes;
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