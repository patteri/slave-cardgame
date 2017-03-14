const Game = require('../models/game');
const HumanPlayer = require('../models/humanPlayer');
const CpuPlayer = require('../models/cpuPlayer');

const PlayerCount = 4;

class GameService {

  constructor() {
    this._games = new Map();
  }

  initializeSocket(socket) {
    socket.on('connection', (socket) => {
      socket.on('joinGame', (gameId, clientId) => {
        let game = this.getGame(gameId);
        if (game && game.registerSocket(clientId, socket)) {
          socket.join(gameId);
        }
        else {
          socket.close();
        }
      });
    });
  }

  // Creates a new game with one human player
  // Returns the game and the player
  createGame(shuffleDeck = true) {
    // Create game, players and deal cards
    let game = new Game(PlayerCount, shuffleDeck);
    let human = new HumanPlayer('You');
    game.addPlayer(human);
    for (let i = 0; i < PlayerCount - 1; ++i) {
      game.addPlayer(new CpuPlayer('CPU ' + (i + 1)));
    }
    game.startGame();

    this._games.set(game.id, game);
    return { game: game, player: human };
  }

  // Gets a game with the specified id
  // Returns null if the game doesn't exist
  getGame(id) {
    if (!this._games.has(id)) {
      return null;
    }
    return this._games.get(id);
  }
}

const gameService = new GameService();

module.exports = gameService;
