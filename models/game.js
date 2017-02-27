const Player = require('./player');
const Deck = require('./deck');
const tokenGenerator = require('../helpers/tokenGenerator');
const socketService = require('../services/socketService');

const PlayingDirection = { CLOCKWISE: 'Clockwise', COUTERCLOCKWISE: 'Counterclockwise' };

class Game {

  // Parameters:
  // playerCount: the number of players in the game
  constructor(playerCount) {
    if (!Number.isInteger(playerCount) || playerCount < 1) {
      throw new Error('Invalid player count');
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
    return this._playingDirection;
  }

  set playingDirection(direction) {
    this._playingDirection = direction;
  }

  addPlayer(type, name) {
    if (this._players.length === this._playerCount) {
      throw new Error('The player number was exceeded');
    }
    if (type == null || !Player.PlayerTypes.hasOwnProperty(type.toUpperCase())) {
      throw new Error('Invalid player type');
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

  // Validates the player and the hit
  validateHit(clientId, cards) {
    // Validate player id
    if (this._turn.id !== clientId) {
      return false;
    }

    // Validate that at least one card is given and the player has the given cards
    if (!Array.isArray(cards) || cards.length === 0) {
      return false;
    }
    for (let i = 0; i < cards.length; ++i) {
      let card = cards[i];
      if (this._turn.hand.find(item => item.suit === card.suit && item.value === card.value) === undefined) {
        return false;
      }
    }

    // TODO: validate against game rules
    return true;
  }

  // Plays the specified cards of the current player in turn.
  // Note that this method does not validate the hit.
  // Validate the hit by calling validateHit().
  playTurn(cards) {
    // Move cards from player's hand to the table
    cards.forEach((card) => {
      let index = this._turn.hand.findIndex(item => item.suit === card.suit && item.value === card.value);
      let handCard = this._turn.hand[index];
      this._turn.hand.splice(index, 1);
      this._table.push(handCard);
    });
    let remainingHand = this._turn.hand;

    // Switch turn
    let index = this._players.indexOf(this._turn);
    index = this._playingDirection === PlayingDirection.CLOCKWISE ? index + 1 : index - 1;
    this._turn = this._players[index % this._players.length];

    this.notifyPlayers();

    // Don't play CPU turns automatically when testing
    if (process.env.NODE_ENV !== 'test') {
      this._turn.playTurn(this);
    }

    return remainingHand;
  }

  notifyPlayers() {
    socketService.emit(this.id, 'turn', { game: this.toJSON() });
  }

  toJSON() {
    return {
      id: this._id,
      table: this._table,
      turn: this._players.indexOf(this._turn),
      direction: this._playingDirection,
      players: this._players.map(player => ({
        name: player.name,
        type: player.type,
        cardCount: player.hand.length
      }))
    };
  }

}

module.exports = Game;
