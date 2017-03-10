const chai = require('chai');
const gameService = require('../../services/gameService');
const Game = require('../../models/game');

const expect = chai.expect;

describe('GameService', () => {
  it('Get a game with an invalid id', () => {
    let game = gameService.getGame('doesn\'t exist');
    expect(game).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('Creating a game doesn\'t crash', () => {
    let id = gameService.createGame().game.id;
    let game = gameService.getGame(id);
    expect(game).to.be.an.instanceof(Game);
  });
});
