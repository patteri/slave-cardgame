const Game = require('../models/game');
const HumanPlayer = require('../models/humanPlayer');
const CpuPlayer = require('../models/cpuPlayer');

const PlayerCount = 4;

class GameService {

  constructor() {
    this._games = new Map();
  }

  // Creates a new game with one human player
  // Returns the game and the player
  createGame() {
    // Create game, players and deal cards
    let game = new Game(PlayerCount);
    let human = new HumanPlayer('You');
    game.addPlayer(human);
    game.addPlayer(new CpuPlayer('CPU 1'));
    game.addPlayer(new CpuPlayer('CPU 2'));
    game.addPlayer(new CpuPlayer('CPU 3'));
    game.dealCards();
    game.turn = human;

    // Generate token for the game and store it
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
