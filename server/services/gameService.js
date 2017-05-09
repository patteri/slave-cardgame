const Game = require('../models/game');
const HumanPlayer = require('../models/humanPlayer');
const CpuPlayer = require('../models/cpuPlayer');
const socketService = require('../services/socketService');
const { GameState, GameValidation, MaxChatMessageLength } = require('../../client/src/shared/constants');

const REMOVE_AFTER_DISCONNECTION_PERIOD = 30000;

class GameService {

  constructor() {
    this._games = new Map();
  }

  socketsInitialized() {
    // Initialize play room socket
    let socket = socketService.getSocket('playRoom');
    socket.on('connection', (socket) => {
      socket.on('register', () => {
        socket.join('playRoom');
        socketService.emitToClient(socket, 'openGamesChanged', this.getOpenGames());
      });
    });

    // Initialize game socket
    socket = socketService.getSocket('game');
    socket.on('connection', (socket) => {
      socket.on('joinGame', (gameId, clientId) => {
        let game = this.getGame(gameId);
        if (game) {
          const player = game.registerSocket(clientId, socket);
          if (player) {
            player.connected = true;
            player.connectionTime = Date.now();
            socket.player = player;
            socket.game = game;
            socket.join(gameId);
            // Sync the latest game state to the joined client
            socketService.emitToClient(socket, 'gameUpdated', { game: game.toJSON() });
          }
          else {
            socketService.emitToClient(socket, 'exception', { message: 'Forbidden' });
          }
        }
        else {
          socketService.emitToClient(socket, 'exception', { message: 'Not found' });
        }
      });
      socket.on('sendChatMessage', (gameId, message) => {
        if (socket.rooms.hasOwnProperty(gameId)) {
          const msg = message.trim().substring(0, MaxChatMessageLength);
          this.sendChatMessage(gameId, socket.player.name, msg);
        }
      });
      socket.on('disconnect', () => {
        // If game hasn't started or is ended, player can be removed immediately
        // If game is ongoing, wait for REMOVE_AFTER_DISCONNECTION_PERIOD for reconnection until remove
        if (socket.game && socket.player) {
          if (socket.game.state === GameState.NOT_STARTED || socket.game.state === GameState.ENDED) {
            this.removePlayerFromGame(socket.game, socket.player);
          }
          else {
            socket.player.connected = false;
            setTimeout((player, game) => {
              // Ensure that the client hasn't reconnected and disconnected again after the timer was started
              if (!player.connected && (Date.now() - player.connectionTime) > REMOVE_AFTER_DISCONNECTION_PERIOD) {
                this.removePlayerFromGame(game, player);
              }
            }, REMOVE_AFTER_DISCONNECTION_PERIOD, socket.player, socket.game);
          }
        }
      });
    });
  }

  sendChatMessage(gameId, sender, message) {
    socketService.emitToRoom('game', gameId, 'chatMessageReceived', {
      sender: sender,
      message: message
    });
  }

  getOpenGames() {
    const openGames = Array.from(this._games.values()).filter(game => game.state === GameState.NOT_STARTED);
    return {
      games: openGames.map(game => ({
        id: game.id,
        createdBy: game.players.find(player => player instanceof HumanPlayer).name,
        playerCount: game._playerCount,
        gameCount: game._gameCount,
        joinedHumanPlayers: game.players.filter(player => player instanceof HumanPlayer).length,
        joinedCpuPlayers: game.players.filter(player => player instanceof CpuPlayer).length
      }))
    };
  }

  removePlayerFromGame(game, player) {
    if (player.socket) {
      player.socket.player = null;
      player.socket.game = null;
      player.socket.disconnect(true);
      player.socket = null;
    }

    switch (game.state) {
      case GameState.NOT_STARTED:
        this.removePlayer(game, player);
        socketService.emitToRoom('playRoom', 'playRoom', 'openGamesChanged', this.getOpenGames());
        break;
      case GameState.PLAYING:
      case GameState.CARD_EXCHANGE:
        this.removePlayer(game, player, true);
        break;
      case GameState.ENDED:
        this.removePlayer(game, player);
        break;
      default:
        break;
    }
  }

  removePlayer(game, player, replace = false) {
    if (!replace) {
      game.removePlayer(player);
    }
    else {
      game.replacePlayerByCpu(player);
    }

    if (game.players.filter(player => player instanceof HumanPlayer).length === 0) {
      game.endGame();
      this._games.delete(game.id);
    }
    else if (!replace) {
      game.players.forEach((item) => {
        socketService.emitToClient(item.socket, 'joinedPlayersChanged', {
          game: game,
          playerIndex: game.players.indexOf(item)
        });
      });
      this.sendChatMessage(game.id, null, "Player '" + player.name + "' left the game...");
    }
    else {
      socketService.emitToRoom('game', game.id, 'joinedPlayersChanged', { game: game });
      this.sendChatMessage(game.id, null, "Player '" + player.name + "' left the game and was replaced by a CPU...");
    }
  }

  validatePlayer(playerName) {
    return !(!(typeof (playerName) === 'string') || playerName.length < GameValidation.minPlayerNameLength ||
      playerName.length > GameValidation.maxPlayerNameLength);
  }

  startNewGame(game) {
    game.startNewGame();
    // Add some delay to make sure that the last joined player has initialized the socket
    setTimeout(() => {
      this.sendChatMessage(game.id, null, 'The game started!');
    }, 750);
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

    this._games.set(game.id, game);

    if (game.isFull()) {
      this.startNewGame(game);
    }
    else {
      socketService.emitToRoom('playRoom', 'playRoom', 'openGamesChanged', this.getOpenGames());
    }

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
      this.startNewGame(game);

      // Notify other players
      game.players.filter(player => player !== human).forEach((player) => {
        socketService.emitToClient(player.socket, 'gameStarted', { game: game, player: player });
      });
    }
    else {
      socketService.emitToRoom('game', game.id, 'joinedPlayersChanged', { game: game });
    }
    socketService.emitToRoom('playRoom', 'playRoom', 'openGamesChanged', this.getOpenGames());

    this.sendChatMessage(game.id, null, "Player '" + human.name + "' joined the game!");

    return { game: game, player: human };
  }

  // Quits the player from a game
  // Returns whether the operation was valid
  quitGame(game, clientId) {
    // Validate player
    let player = game.players.find(item => item.id === clientId);
    if (player === undefined) {
      return false;
    }

    this.removePlayerFromGame(game, player);

    return true;
  }

}

const gameService = new GameService();

module.exports = gameService;
