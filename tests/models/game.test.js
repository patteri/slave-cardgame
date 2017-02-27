const chai = require('chai');
const Game = require('../../models/game');
const Player = require('../../models/player');
const gameService = require('../../services/gameService');

const expect = chai.expect;

describe('Game', () => {
  it('Invalid player count (number < 1)', () => {
    expect(() => new Game(0)).to.throw('Invalid player count');
  });

  it('Player count exceeds', () => {
    let game = new Game(2);
    game.addPlayer(Player.PlayerTypes.CPU, 'cpu');
    game.addPlayer(Player.PlayerTypes.CPU, 'cpu2');
    expect(() => game.addPlayer(Player.PlayerTypes.CPU, 'cpu3')).to.throw('The player number was exceeded');
  });

  it('Create game and add players: doesn\'t crash', () => {
    let game = new Game(2);
    game.addPlayer(Player.PlayerTypes.HUMAN, 'human');
    game.addPlayer(Player.PlayerTypes.CPU, 'cpu2');
  });

  it('Validation unsuccessful: no cards given', () => {
    let gameData = gameService.createGame();
    let valid = gameData.game.validateHit(gameData.player.id, []);
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful: invalid card given', () => {
    let gameData = gameService.createGame();
    let card = gameData.player.hand[0];
    gameData.player.hand.splice(0, 1);
    let valid = gameData.game.validateHit(gameData.player.id, [ card ]);
    expect(valid).to.equal(false);
  });

  it('Validation successful', () => {
    let gameData = gameService.createGame();
    let valid = gameData.game.validateHit(gameData.player.id, [ gameData.player.hand[0] ]);
    expect(valid).to.equal(true);
  });

  it('Played cards move from player\'s hand to the table', () => {
    let game = gameService.createGame().game;
    expect(game._players[0].hand.length).to.equal(13);
    let card1 = game._players[0].hand[0];
    let card2 = game._players[0].hand[1];
    game.playTurn([ card1, card2 ]);
    expect(game._players[0].hand.length).to.equal(11);
    expect(game._players[0].hand.indexOf(card1)).to.equal(-1);
    expect(game._players[0].hand.indexOf(card2)).to.equal(-1);
    expect(game._table.length).to.equal(2);
    expect(game._table[0]).to.equal(card1);
    expect(game._table[1]).to.equal(card2);
  });

  it('Player turns are changed successfully', () => {
    let game = gameService.createGame().game;
    expect(game._turn).to.equal(game._players[0]);
    game.playTurn([ game._players[0].hand[0] ]);
    expect(game._turn).to.equal(game._players[1]);
    game.playTurn([ game._players[1].hand[0] ]);
    expect(game._turn).to.equal(game._players[2]);
    game.playTurn([ game._players[2].hand[0] ]);
    expect(game._turn).to.equal(game._players[3]);
    game.playTurn([ game._players[3].hand[0] ]);
    expect(game._turn).to.equal(game._players[0]);
  });
});
