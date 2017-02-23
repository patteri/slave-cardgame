const chai = require('chai');
const Game = require('../../models/game');
const Player = require('../../models/player');

const expect = chai.expect;

describe('Game', () => {
  it('Valid game', () => {
    let game = new Game(2);
    game.addPlayer(Player.PlayerTypes.HUMAN, 'human');
    game.addPlayer(Player.PlayerTypes.CPU, 'cpu2');
  });

  it('Invalid player count (number < 1)', () => {
    expect(() => new Game(0)).to.throw('Invalid player count');
  });

  it('Player count exceeds', () => {
    let game = new Game(2);
    game.addPlayer(Player.PlayerTypes.CPU, 'cpu');
    game.addPlayer(Player.PlayerTypes.CPU, 'cpu2');
    expect(() => game.addPlayer(Player.PlayerTypes.CPU, 'cpu3')).to.throw('The player number was exceeded');
  });
});
