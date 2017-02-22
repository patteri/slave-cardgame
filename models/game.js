const Player = require('./player');
const Deck = require('./deck');
const Card = require('./card');
const tokenGenerator = require('../helpers/tokenGenerator');

const PlayingDirection = {CLOCKWISE: "Clockwise", COUTERCLOCKWISE: "Counterclockwise"};

class Game {

  // Parameters:
  // playerCount: the number of players in the game
  constructor(playerCount) {
    if (!Number.isInteger(playerCount) || playerCount < 1) {
      throw new Error("Invalid player count");
    }

    this._id = tokenGenerator.generateToken();
    this._playerCount = playerCount;
    this._players = [];
    this._deck = new Deck(true);
    this._table = [];
    this._turn = null;
    this._playingDirection = PlayingDirection.CLOCKWISE;
  }

  get id() {
    return this._id;
  }

  get turn() {
    return this._turn;
  }

  set turn(player) {
    this._turn = player;
  }

  get playingDirection() {
    return this._playingDirection
  }

  set playingDirection(direction) {
    this._playingDirection = direction;
  }

  addPlayer(type, name) {
    if (this._players.length == this._playerCount) {
      throw new Error("The player number was exceeded");
    }
    if (type == null || !Player.PlayerTypes.hasOwnProperty(type.toUpperCase())) {
      throw new Error("Invalid player type");
    }

    let player = new Player(type, name);
    this._players.push(player);
    return player;
  }

  dealCards() {
    this._deck.deck.forEach((card, index) => {
      this._players[index % this._players.length].hand.push(card);
    });
  }

  toJSON() {
    return {
      id: this._id,
      table: this._table,
      turn: this._players.indexOf(this._turn),
      direction: this._playingDirection,
      players: this._players.map((player) => {
        return {
          name: player.name,
          type: player.type,
          cardCount: player.hand.length
        };
      })
    };
  }

}

module.exports = Game;