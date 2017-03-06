const Deck = require('./deck');
const CpuPlayer = require('./cpuPlayer');
const tokenGenerator = require('../helpers/tokenGenerator');
const socketService = require('../services/socketService');
const CardHelper = require('../helpers/cardHelper');

const PlayingDirection = { CLOCKWISE: 'Clockwise', COUTERCLOCKWISE: 'Counterclockwise' };
const PlayingStatus = { HIT: 'Hit', PASS: 'Pass', WAITING: 'Waiting' };

class Game {

  // Parameters:
  // playerCount: the number of players in the game
  // shuffleDeck: true, if the deck is shuffled
  constructor(playerCount, shuffleDeck = true) {
    if (!Number.isInteger(playerCount) || playerCount < 1) {
      throw new Error('Invalid player count');
    }

    this._id = tokenGenerator.generateToken();
    this._playerCount = playerCount;
    this._players = [];
    this._deck = new Deck(shuffleDeck);
    this._table = [];
    this._previousHit = {
      player: null,
      cards: []
    };
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

  get previousHit() {
    return this._previousHit;
  }

  isRevolution() {
    return this._playingDirection === PlayingDirection.COUTERCLOCKWISE;
  }

  addPlayer(player) {
    if (this._players.length === this._playerCount) {
      throw new Error('The player number was exceeded');
    }

    this._players.push(player);
  }

  // Deals the cards and sets the starting turn
  dealCards() {
    this._deck.deck.forEach((card, index) => {
      this._players[index % this._players.length].hand.push(card);
    });

    // The player with the two of clubs gets the starting turn
    this._turn = this._players.find(player =>
       CardHelper.findTwoOfClubs(player.hand) !== undefined
    );
  }

  // Validates the player and the hit
  validateHit(clientId, cards) {
    // Validate player id
    if (this._turn.id !== clientId) {
      return false;
    }

    // Validate that the player has the given cards
    if (!Array.isArray(cards)) {
      return false;
    }
    for (let i = 0; i < cards.length; ++i) {
      let card = cards[i];
      if (this._turn.hand.find(item => item.suit === card.suit && item.value === card.value) === undefined) {
        return false;
      }
    }

    return CardHelper.validateHit(cards, this._previousHit.cards, this._table.length === 0, this.isRevolution());
  }

  startCpuGame() {
    // Don't play CPU turns automatically when testing
    if (process.env.NODE_ENV !== 'test') {
      this._turn.playTurn(this);
    }
  }

  // Plays the specified cards of the current player in turn.
  // Note that this method does not validate the hit.
  // Validate the hit by calling validateHit().
  playTurn(cards) {
    if (cards.length > 0) {
      this._previousHit.cards = [];
      this._previousHit.player = this._turn;
    }

    // Move cards from player's hand to the table
    cards.forEach((card) => {
      let index = this._turn.hand.findIndex(item => item.suit === card.suit && item.value === card.value);
      let handCard = this._turn.hand[index];
      this._turn.hand.splice(index, 1);
      this._table.push(handCard);
      this._previousHit.cards.push(card);
    });
    let remainingHand = this._turn.hand;
    // If finished playing, assign position
    if (remainingHand.length === 0) {
      this._turn.position = this.getNextPosition();
    }

    // Check revolution rule
    if (cards.length === 4) {
      this._playingDirection = this.isRevolution() ? PlayingDirection.CLOCKWISE : PlayingDirection.COUTERCLOCKWISE;
    }

    // Switch turn
    let index = this._players.indexOf(this._turn);
    do {
      index = this.isRevolution() ? index - 1 : index + 1;
      if (index === -1) {
        index = this._players.length - 1;
      }
      this._turn = this._players[index % this._players.length];

      // If full round without hits, clear the table
      if (this._turn === this._previousHit.player) {
        this._previousHit.cards = [];
      }
    }
    while (this._turn.hand.length === 0);

    // Check if the game ended
    if (this._players.filter(item => item.hand.length > 0).length === 1) {
      this._turn.position = this.getNextPosition();
      this.notifyForGameEnd();
    }
    else {
      this.notifyForHit();
      this.startCpuGame();
    }

    return remainingHand;
  }

  getNextPosition() {
    return Math.max(...this._players.map(item => item.position)) + 1;
  }

  notifyForHit() {
    socketService.emit(this.id, 'turnChanged', { game: this.toJSON() });
  }

  notifyForGameEnd() {
    let results = this._players.map(player => ({
      name: player.name,
      isCpu: player instanceof CpuPlayer,
      position: player.position
    })).sort((first, second) => first.position - second.position);
    socketService.emit(this.id, 'gameEnded', { game: this.toJSON(), results: results });
  }

  getPlayingStatus(player) {
    if (this._previousHit.player != null) {
      let prevHitIdx = this._players.indexOf(this._previousHit.player);
      let playerIdx = this._players.indexOf(player);
      let turnIdx = this._players.indexOf(this._turn);

      let turnNumber = turnIdx > prevHitIdx ? turnIdx - prevHitIdx : (this._players.length - prevHitIdx) + turnIdx;
      let playerNumber = playerIdx > prevHitIdx ?
      playerIdx - prevHitIdx : (this._players.length - prevHitIdx) + playerIdx;
      // Invert index when revolution
      if (this.isRevolution() && turnNumber !== this._players.length) {
        turnNumber = this._players.length - turnNumber;
      }
      if (this.isRevolution() && playerNumber !== this._players.length) {
        playerNumber = this._players.length - playerNumber;
      }

      if (player === this._previousHit.player && player !== this._turn) {
        return PlayingStatus.HIT;
      }
      else if ((playerNumber < turnNumber) && player.hand.length > 0) {
        return PlayingStatus.PASS;
      }
    }
    return PlayingStatus.WAITING;
  }

  toJSON() {
    return {
      id: this._id,
      isFirstTurn: this._table.length === 0,
      isRevolution: this.isRevolution(),
      previousHit: this._previousHit.cards,
      players: this._players.map(player => ({
        name: player.name,
        isCpu: player instanceof CpuPlayer,
        cardCount: player.hand.length,
        turn: player === this._turn,
        status: this.getPlayingStatus(player)
      }))
    };
  }

}

module.exports = Game;
