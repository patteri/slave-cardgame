const Game = require('../models/game');
const HumanPlayer = require('../models/humanPlayer');
const CpuPlayer = require('../models/cpuPlayer');
const socketService = require('../services/socketService');
const { GameValidation, MaxChatMessageLength } = require('../../common/constants');

class GameService {

  constructor() {
    this._games = new Map();
  }

  initializeSocket(socket) {
    socket.on('connection', (socket) => {
      socket.on('joinGame', (gameId, clientId) => {
        let game = this.getGame(gameId);
        if (game) {
          const player = game.registerSocket(clientId, socket);
          if (player) {
            socket.player = player;
            socket.join(gameId);
            // Send the latest game state to the joined client to avoid timing issues
            // between call to join API and registering the socket
            socketService.emitToClient(socket, 'gameUpdated', { game: game.toJSON() });
          }
        }
        else {
          socket.close();
        }
      });
      socket.on('sendChatMessage', (gameId, message) => {
        if (socket.rooms.hasOwnProperty(gameId)) {
          const msg = message.trim().substring(0, MaxChatMessageLength);
          socketService.emitToGame(gameId, 'chatMessageReceived', {
            sender: socket.player.name,
            message: msg
          });
        }
      });
      socket.on('disconnect', (socket) => { // eslint-disable-line no-unused-vars
        // TODO: handle disconnection
      });
    });
  }

  validatePlayer(playerName) {
    if (!(typeof (playerName) === 'string') || playerName.length < GameValidation.minPlayerNameLength ||
      playerName.length > GameValidation.maxPlayerNameLength) {
      return false;
    }
    return true;
  }

  // Gets a game with the specified id
  // Returns null if the game doesn't exist
  getGame(id) {
    if (!this._games.has(id)) {
      return null;
    }
    return this._games.get(id);
  }

  // Creates a new game with one human player and specified CPU player count
  // Returns the game and the player
  // If player count is fulfilled, starts the game immediately
  createGame(playerName, playerCount, cpuPlayerCount, gameCount, shuffleDeck = true) {
    if (!this.validatePlayer(playerName)) {
      return null;
    }
    if (playerCount < GameValidation.minPlayerCount || playerCount > GameValidation.maxPlayerCount ||
      cpuPlayerCount < 0 || cpuPlayerCount > playerCount - 1) {
      return null;
    }
    if (gameCount < GameValidation.minGameCount || gameCount > GameValidation.maxGameCount) {
      return null;
    }

    // Create game, players and deal cards
    let game = new Game(playerCount, gameCount, shuffleDeck);
    let human = new HumanPlayer(playerName);
    game.addPlayer(human);

    for (let i = 0; i < cpuPlayerCount; ++i) {
      game.addPlayer(new CpuPlayer('Computer ' + (i + 1)));
    }

    if (game.isFull()) {
      game.startNewGame();
    }

    this._games.set(game.id, game);
    return { game: game, player: human };
  }

  // Joins a player into the game
  // Returns the game and the player
  // If player count is fulfilled, starts the game immediately
  joinGame(game, playerName) {
    if (!this.validatePlayer(playerName)) {
      return null;
    }
    if (game.isFull()) {
      return null;
    }

    let human = new HumanPlayer(playerName);
    game.addPlayer(human);
    if (game.isFull()) {
      game.startNewGame();

      // Notify other players
      game.players.filter(player => player !== human).forEach((player) => {
        socketService.emitToClient(player.socket, 'gameStarted', { game: game, player: player });
      });
    }
    else {
      // Notify other players
      game.players.filter(player => player !== human).forEach((player) => {
        socketService.emitToClient(player.socket, 'playerJoined', { game: game });
      });
    }

    return { game: game, player: human };
  }

}

const gameService = new GameService();

module.exports = gameService;
