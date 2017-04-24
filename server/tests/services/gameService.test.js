const chai = require('chai');
const gameService = require('../../services/gameService');
const Game = require('../../models/game');

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
});
