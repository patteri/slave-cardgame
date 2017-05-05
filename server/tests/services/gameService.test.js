const chai = require('chai');
const gameService = require('../../services/gameService');
const Game = require('../../models/game');
const HumanPlayer = require('../../models/humanPlayer');
const CpuPlayer = require('../../models/cpuPlayer');
const { GameState } = require('../../../client/src/shared/constants');

const expect = chai.expect;

describe('GameService', () => {
  it('Get a game with an invalid id', () => {
    let game = gameService.getGame('does not exist');
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Invalid game creation (too short player name)', () => {
    let game = gameService.createGame('', 4, 3, 1);
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Invalid game creation (too long player name)', () => {
    let game = gameService.createGame('1234567890abc', 4, 3, 1);
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Invalid game creation (too small player count)', () => {
    let game = gameService.createGame('Human', 3, 2, 1);
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Invalid game creation (too short player name)', () => {
    let game = gameService.createGame('Human', 9, 8, 1);
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Invalid game creation (cpu player count)', () => {
    let game = gameService.createGame('Human', 4, 4, 1);
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Invalid game creation (game count)', () => {
    let game = gameService.createGame('Human', 4, 3, 0);
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Successful game creation', () => {
    let id = gameService.createGame('Human', 4, 3, 1).game.id;
    let game = gameService.getGame(id);
    expect(game).to.be.an.instanceof(Game);
  });

  it('Invalid game join (player name)', () => {
    let game = gameService.createGame('Human', 4, 2, 1).game;
    let result = gameService.joinGame(game, '1234567890abc');
    expect(result).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Invalid game join (game already full)', () => {
    let game = gameService.createGame('Human', 4, 3, 1).game;
    let result = gameService.joinGame(game, 'Human 2');
    expect(result).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Successful game join', () => {
    let game = gameService.createGame('Human', 4, 2, 1).game;
    let result = gameService.joinGame(game, 'Human 2');
    expect(result.game).to.be.an.instanceof(Game);
  });

  it('Invalid game quit (player id)', () => {
    let game = gameService.createGame('Human', 4, 3, 1).game;
    let result = gameService.quitGame(game, 'invalid_id');
    expect(result).to.equal(false);
  });

  it('Successful game quit, game ended', () => {
    let game = gameService.createGame('Human', 4, 3, 1).game;
    let result = gameService.quitGame(game, game.players[0].id);
    expect(result).to.equal(true);
    expect(game.state).to.equal(GameState.ENDED);
  });

  it('Successful game quit, game not started', () => {
    let game = gameService.createGame('Human', 4, 1, 1).game;
    gameService.joinGame(game, 'Human 2');
    expect(game.players.length).to.equal(3);
    let result = gameService.quitGame(game, game.players[0].id);
    expect(result).to.equal(true);
    expect(game.state).to.equal(GameState.NOT_STARTED);
    expect(game.players.length).to.equal(2);
    expect(game.players[1].name).to.equal('Human 2');
  });

  it('Successful game quit, player replaced', () => {
    let game = gameService.createGame('Human', 4, 2, 1).game;
    gameService.joinGame(game, 'Human 2');
    expect(game.players[0]).to.be.an.instanceof(HumanPlayer);
    let result = gameService.quitGame(game, game.players[0].id);
    expect(result).to.equal(true);
    expect(game.state).to.equal(GameState.PLAYING);
    expect(game.players[0]).to.be.an.instanceof(CpuPlayer);
  });

  it('Game is removed after game ended', () => {
    let game = gameService.createGame('Human', 4, 3, 1).game;
    gameService.quitGame(game, game.players[0].id);
    let result = gameService.getGame(game.id);
    expect(result).to.be.null; // eslint-disable-line no-unused-expressions
  });
});
