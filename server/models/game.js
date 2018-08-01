const events = require('events');
const _ = require('lodash');
const Deck = require('./deck');
const Card = require('../../client/src/shared/card');
const CpuPlayer = require('./cpuPlayer');
const HumanPlayer = require('./humanPlayer');
const authService = require('../services/authService');
const socketService = require('../services/socketService');
const statisticsService = require('../services/statisticsService');
const CardHelper = require('../../client/src/shared/cardHelper');
const {
  GameState,
  PlayerState,
  PlayerHitState,
  CardExchangeType,
  TimerValues } = require('../../client/src/shared/constants');

const AIInterval = 1000;
const StartCpuGameInterval = 1000;
const StartNewRoundInterval = 4000;

const PlayingDirection = { CLOCKWISE: 'Clockwise', COUTERCLOCKWISE: 'Counterclockwise' };

class Game {

  // Parameters:
  // playerCount: the number of players in the game
  // gameCount: the number of games to be played
  // shuffleDeck: true, if the deck is shuffled
  constructor(playerCount, gameCount, shuffleDeck = true) {
    if (!Number.isInteger(playerCount) || playerCount < 1) {
      throw new Error('Invalid player count');
    }

    this._id = authService.generateRandomToken(8);
    this._playerCount = playerCount;
    this._gameCount = gameCount;
    this._currentGameIndex = 0;
    this._players = [];
    this._dealStartIndex = 0;
    this._configuration = {
      aiInterval: AIInterval,
      startCpuGameInterval: StartCpuGameInterval,
      startNewRoundInterval: StartNewRoundInterval
    };
    this._eventEmitter = new events.EventEmitter();

    this.initializeNewGame(shuffleDeck);
  }

  get id() {
    return this._id;
  }

  get playerCount() {
    return this._playerCount;
  }

  get players() {
    return this._players;
  }

  get table() {
    return this._table;
  }

  get previousHit() {
    return this._previousHit;
  }

  get state() {
    return this._state;
  }

  get eventEmitter() {
    return this._eventEmitter;
  }

  setTurn(player, trackInactivity = false) {
    if (this._turn) {
      this._turn.lastActivityTime = Date.now();
    }

    this._turn = player;

    if (trackInactivity && this.getHumanPlayers().length > 1 && player instanceof HumanPlayer) {
      setTimeout((player) => {
        this.inactivityCheck(player, TimerValues.hitInactivityMaxPeriod);
      }, TimerValues.hitInactivityMaxPeriod - TimerValues.inactivityWarningTime, player);
    }
  }

  getHumanPlayers() {
    return this._players.filter(player => player instanceof HumanPlayer);
  }

  inactivityCheck(player, period) {
    if ((Date.now() - player.lastActivityTime) > (period - TimerValues.inactivityWarningTime) &&
      this._players.find(item => item.id === player.id) !== undefined) {
      this.eventEmitter.emit('playerInactiveWarning', this, player, TimerValues.inactivityWarningTime / 1000);
      setTimeout((player) => {
        if ((Date.now() - player.lastActivityTime) > period &&
          this._players.find(item => item.id === player.id) !== undefined) {
          this.eventEmitter.emit('playerInactive', this, player);
        }
      }, TimerValues.inactivityWarningTime, player);
    }
  }

  // Registers a socket for the specified client
  // Returns the player if succeeded, otherwise null
  registerSocket(clientId, socket) {
    let player = this._players.find(item => item.id === clientId);
    if (player) {
      player.socket = socket;
      return player;
    }
    return null;
  }

  registerEventListener(player) {
    player.eventEmitter.on('comment', (player, comment) => {
      this.onPlayerComment(player, comment);
    });
  }

  onPlayerComment(player, comment) {
    socketService.sendChatMessage(this.id, player.name, comment);
  }

  endGame() {
    this._state = GameState.ENDED;
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

    if (player instanceof CpuPlayer) {
      this.registerEventListener(player);
    }
  }

  removePlayer(player) {
    _.remove(this._players, item => item.id === player.id);
  }

  replacePlayerByCpu(player) {
    const cpuPlayer = new CpuPlayer(player.name);
    cpuPlayer.assign(player);
    this.registerEventListener(cpuPlayer);
    const index = this._players.indexOf(player);
    this._players[index] = cpuPlayer;

    if (this._turn === player) {
      this.setTurn(cpuPlayer);
      if (this.state === GameState.PLAYING) {
        this.startCpuGame();
      }
    }
    if (this.state === GameState.CARD_EXCHANGE && cpuPlayer.cardsForExchange == null) {
      this.setCardsForExchange(cpuPlayer.id, cpuPlayer.selectCardsForExchange());
    }

    // Record interruption
    statisticsService.recordGame(player.name, this._players.length, this._players.length).then(() => {
      statisticsService.recordTournament(player.name, this._players.length, this._players.length, true);
    });
  }

  dealCards() {
    this._deck.deck.forEach((card, index) => {
      this._players[(index + this._dealStartIndex) % this._players.length].hand.push(card);
    });
  }

  setStartingTurn() {
    // The player with the two of clubs gets the starting turn
    this.setTurn(this._players.find(player =>
      CardHelper.findTwoOfClubs(player.hand) !== undefined
    ), true);
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
      socketService.emitToRoom('game', this.id, 'newRoundStarted', { game: this.toJSON() });
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
    if (process.env.NODE_ENV !== 'test' && this._turn instanceof CpuPlayer) {
      // Decrease AIInterval if ace is played
      let timeout = this._configuration.aiInterval;
      if (this._previousHit.cards.length > 0 && this._previousHit.cards[0].value === 1 &&
        this._previousHit.player !== this._turn) {
        timeout = Math.round(timeout * 0.667);
      }

      setTimeout(() => {
        const cardsToPlay = this._turn.getNextCardsToPlay(
          this.previousHit.cards,
          this.isRevolution(),
          this.table,
          this.getPlayersInGame().length === this.playerCount);
        this.playTurn(cardsToPlay);
      }, timeout);
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
    this.setPlayerHitState(cards);

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
      this.setPositionAndPoints(this._turn);
    }

    // Check revolution rule
    if (cards.length === 4) {
      this._playingDirection = this.isRevolution() ? PlayingDirection.CLOCKWISE : PlayingDirection.COUTERCLOCKWISE;
    }

    // Switch turn
    let index = this._players.indexOf(this._turn);
    let turn = null;
    do {
      index = this.isRevolution() ? index - 1 : index + 1;
      if (index === -1) {
        index = this._players.length - 1;
      }
      turn = this._players[index % this._players.length];

      // If full round without hits, clear the table
      if (turn === this._previousHit.player) {
        this._previousHit.cards = [];
      }
    }
    while (turn.hand.length === 0);

    const gameEnded = this.getPlayersInGame().length === 1;

    this.setTurn(turn, !gameEnded);

    if (gameEnded) {
      this.setPositionAndPoints(this._turn);
      // Dealing starts from the next of the player who lost
      this._dealStartIndex = (this._players.indexOf(this._turn) + 1) % this._players.length;
      this.gameEnded();
    }
    else {
      this.notifyForHit();
      this.startCpuGame();
    }

    return remainingHand;
  }

  setPlayerHitState(cards) {
    this._turn.hitState = cards.length === 0 ? PlayerHitState.PASS : PlayerHitState.HIT;
    if (this._turn.hitState === PlayerHitState.HIT) {
      for (let i = 1; i < this._players.length; ++i) {
        this._players[(this._players.indexOf(this._turn) + i) % this._players.length].hitState = PlayerHitState.WAITING;
      }
    }
  }

  setPositionAndPoints(player) {
    player.position = Math.max(...this._players.map(item => item.position)) + 1;
    player.points += this._players.length - player.position;
  }

  notifyForHit() {
    socketService.emitToRoom('game', this.id, 'gameUpdated', { game: this.toJSON() });
  }

  calculateResultsAndNotify(finished = false) {
    let currentResults = this._players.map(player => ({
      name: player.name,
      isCpu: player instanceof CpuPlayer,
      position: player.position,
      points: this._players.length - player.position
    })).sort((first, second) => first.position - second.position);
    let overallResults = this._players.map(player => ({
      name: player.name,
      isCpu: player instanceof CpuPlayer,
      points: player.points
    })).sort((first, second) => second.points - first.points);
    let previousPosition = -1;
    let previousPoints = -1;
    overallResults.forEach((player, index) => {
      player.position = player.points === previousPoints ? previousPosition : index + 1;
      previousPosition = player.position;
      previousPoints = player.points;
    });

    currentResults.filter((result => !result.isCpu)).forEach((result) => {
      statisticsService.recordGame(result.name, result.position, this._players.length).then(() => {
        if (finished) {
          const oResult = overallResults.find(item => item.name === result.name);
          statisticsService.recordTournament(result.name, oResult.position, this._players.length);
        }
      });
    });

    socketService.emitToRoom('game', this.id, 'gameEnded', {
      game: this.toJSON(),
      results: {
        currentResults: currentResults,
        overallResults: overallResults,
        gameNumber: this._currentGameIndex,
        totalGameCount: this._gameCount
      }
    });
  }

  gameEnded() {
    this._currentGameIndex += 1;

    if (this._currentGameIndex < this._gameCount) {
      this.calculateResultsAndNotify();

      if (this.getHumanPlayers().length > 1) {
        // Start tracking inactivity
        setTimeout(() => {
          this._players.filter(player => player instanceof HumanPlayer).forEach((player) => {
            this.inactivityCheck(player, TimerValues.cardExchangeInactivityMaxPeriod);
          });
        }, TimerValues.cardExchangeInactivityMaxPeriod - TimerValues.inactivityWarningTime);
      }

      this.initializeNewGame(true, GameState.CARD_EXCHANGE);
      this.dealCards();

      this._players.forEach((player) => {
        // Set exchange rules
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

        // Initialize hit states
        this._players.forEach((player) => {
          player.hitState = PlayerHitState.WAITING;
        });
      });

      // CPU players select cards for exchange
      this._players.forEach((player) => {
        if (player instanceof CpuPlayer) {
          this.setCardsForExchange(player.id, player.selectCardsForExchange());
        }
      });
    }
    else {
      this._state = GameState.ENDED;
      this.calculateResultsAndNotify(true);
      this.eventEmitter.emit('gameEnded', this);
    }
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
    player.lastActivityTime = Date.now();

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
        status: player.hand.length === 0 ? PlayerState.OUT_OF_GAME : PlayerState.PLAYING,
        hitStatus: player.hitState
      }))
    };
  }

}

module.exports = Game;
