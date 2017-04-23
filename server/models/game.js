const _ = require('lodash');
const Deck = require('./deck');
const Card = require('../../common/card');
const CpuPlayer = require('./cpuPlayer');
const tokenGenerator = require('../helpers/tokenGenerator');
const socketService = require('../services/socketService');
const CardHelper = require('../../common/cardHelper');
const { GameState, PlayerState, CardExchangeType } = require('../../common/constants');

const StartCpuGameInterval = 1000;
const StartNewRoundInterval = 5000;

const PlayingDirection = { CLOCKWISE: 'Clockwise', COUTERCLOCKWISE: 'Counterclockwise' };

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
    this._dealStartIndex = 0;
    this._configuration = {
      startCpuGameInterval: StartCpuGameInterval,
      startNewRoundInterval: StartNewRoundInterval
    };
    this.initializeNewGame(shuffleDeck);
  }

  get id() {
    return this._id;
  }

  get players() {
    return this._players;
  }

  get table() {
    return this._table;
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

  get state() {
    return this._state;
  }

  // Registers a socket for the specified client
  // Returns true if succeeded, otherwise false
  registerSocket(clientId, socket) {
    let player = this._players.find(item => item.id === clientId);
    if (player) {
      player.socket = socket;
      return true;
    }
    return false;
  }

  isFull() {
    return this._players.length === this._playerCount;
  }

  initializeNewGame(shuffleDeck = true, state = GameState.NOT_STARTED) {
    this._deck = new Deck(shuffleDeck);
    this._players.forEach((player) => {
      player.hand = [];
    });
    this._table = [];
    this._previousHit = {
      player: null,
      cards: []
    };
    this._turn = null;
    this._state = state;
    this._playingDirection = PlayingDirection.CLOCKWISE;
  }

  isRevolution() {
    return this._playingDirection === PlayingDirection.COUTERCLOCKWISE;
  }

  getPlayersInGame() {
    return this._players.filter(item => item.hand.length > 0);
  }

  addPlayer(player) {
    if (this._players.length === this._playerCount) {
      throw new Error('The player number was exceeded');
    }

    this._players.push(player);
  }

  dealCards() {
    this._deck.deck.forEach((card, index) => {
      this._players[(index + this._dealStartIndex) % this._players.length].hand.push(card);
    });
  }

  setStartingTurn() {
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
    if (!this._turn.hasCardsInHand(cards)) {
      return false;
    }

    return CardHelper.validateHit(cards, this._previousHit.cards, this._table.length === 0, this.isRevolution());
  }

  startNewGame() {
    this.dealCards();
    this.startNewRound();

    // If the first player in turn is CPU, start CPU game
    if (this._turn instanceof CpuPlayer) {
      setTimeout(() => {
        this.startCpuGame();
      }, this._configuration.startCpuGameInterval);
    }
  }

  initializeNewRound() {
    this._players.forEach((player) => {
      player.initializeRoundData();
    });

    this.startNewRound();
    setTimeout(() => {
      socketService.emitToGame(this.id, 'newRoundStarted', { game: this.toJSON() });
      if (this._turn instanceof CpuPlayer) {
        setTimeout(() => {
          this.startCpuGame();
        }, this._configuration.startCpuGameInterval);
      }
    }, this._configuration.startNewRoundInterval);
  }

  startNewRound() {
    this.setStartingTurn();
    this._state = GameState.PLAYING;
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
      let handCard = this._turn.hand.find(item => Card.isEqual(item, card));
      this._turn.removeCardsFromHand([ handCard ]);
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
    if (this.getPlayersInGame().length === 1) {
      this._turn.position = this.getNextPosition();
      // Dealing starts from the next of the player who lost
      this._dealStartIndex = (this._players.indexOf(this._turn) + 1) % this._players.length;
      this.notifyForGameEnd();
      this.gameEnded();
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
    socketService.emitToGame(this.id, 'turnChanged', { game: this.toJSON() });
  }

  notifyForGameEnd() {
    let results = this._players.map(player => ({
      name: player.name,
      isCpu: player instanceof CpuPlayer,
      position: player.position
    })).sort((first, second) => first.position - second.position);
    socketService.emitToGame(this.id, 'gameEnded', { game: this.toJSON(), results: results });
  }

  gameEnded() {
    this.initializeNewGame(true, GameState.CARD_EXCHANGE);
    this.dealCards();

    // Set exchange rule for all players
    this._players.forEach((player) => {
      let count = 0;
      if (player.position === 1 || player.position === this._players.length) {
        count = 2;
      }
      else if (player.position === 2 || player.position === this._players.length - 1) {
        count = 1;
      }
      let type = CardExchangeType.NONE;
      if (count > 0) {
        type = player.position <= (this._players.length / 2) ? CardExchangeType.FREE : CardExchangeType.BEST;
      }
      let toPlayer = this._players.find(item => item.position === this._players.length - player.position + 1);
      if (type === CardExchangeType.NONE) {
        toPlayer = null;
      }

      player.cardExchangeRule = {
        exchangeCount: count,
        exchangeType: type,
        toPlayer: toPlayer
      };
    });

    // CPU players select cards for exchange
    this._players.forEach((player) => {
      if (player instanceof CpuPlayer) {
        let cards = player.selectCardsForExchange();
        this.setCardsForExchange(player.id, cards);
      }
    });
  }

  getPlayerState(player) {
    if (player.hand.length === 0) {
      return PlayerState.OUT_OF_GAME;
    }
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
        return PlayerState.HIT;
      }
      else if ((playerNumber < turnNumber) && player.hand.length > 0) {
        return PlayerState.PASS;
      }
    }
    return PlayerState.WAITING;
  }

  getCardsForExchange(clientId) {
    // Validate player
    let player = this._players.find(item => item.id === clientId);
    if (player === undefined) {
      return null;
    }

    return {
      cards: player.hand,
      exchangeRule: {
        exchangeCount: player.cardExchangeRule.exchangeCount,
        exchangeType: player.cardExchangeRule.exchangeType,
        toPlayer: player.cardExchangeRule.toPlayer ? player.cardExchangeRule.toPlayer.toShortJSON() : null
      }
    };
  }

  setCardsForExchange(clientId, cards) {
    // Validate player
    let player = this._players.find(item => item.id === clientId);
    if (player === undefined) {
      return false;
    }

    // Validate that the player has the given cards
    if (!player.hasCardsInHand(cards)) {
      return false;
    }

    // Validate that has rule and cards are not already given
    if (player.cardExchangeRule == null || player.cardsForExchange != null) {
      return false;
    }

    // Validate cards against exchange rule
    if (player.cardExchangeRule.exchangeCount !== cards.length) {
      return false;
    }
    switch (player.cardExchangeRule.exchangeType) {
      case CardExchangeType.FREE:
        break;
      case CardExchangeType.BEST: {
        let bestCards = _.takeRight(player.hand.sort(CardHelper.compareCards), player.cardExchangeRule.exchangeCount);
        if (_.intersectionWith(bestCards, cards, Card.isEqual).length !== bestCards.length) {
          return false;
        }
        break;
      }
      case CardExchangeType.NONE:
        break;
      default:
        return false;
    }

    player.cardsForExchange = cards;

    // Check if everybody has selected cards for exchange
    if (this._players.filter(player => player.cardsForExchange != null).length === this._players.length) {
      this.exchangeCards(this._players.filter(player => player.cardExchangeRule.exchangeType !==
      CardExchangeType.NONE));
      this.initializeNewRound();
    }

    return true;
  }

  exchangeCards(players) {
    players.forEach((player) => {
      player.removeCardsFromHand(player.cardsForExchange);
      player.cardExchangeRule.toPlayer.hand.push(...player.cardsForExchange);
    });

    players.forEach((player) => {
      player.cardExchangeRule.toPlayer.notifyForCardExchange(player.cardsForExchange, player);
    });
  }

  toJSON() {
    return {
      id: this._id,
      playerCount: this._playerCount,
      state: this._state,
      isFirstTurn: this._table.length === 0,
      isRevolution: this.isRevolution(),
      previousHit: this._previousHit.cards,
      players: this._players.map(player => ({
        name: player.name,
        isCpu: player instanceof CpuPlayer,
        cardCount: player.hand.length,
        turn: player === this._turn,
        status: this.getPlayerState(player)
      }))
    };
  }

}

module.exports = Game;
