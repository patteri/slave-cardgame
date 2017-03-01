const chai = require('chai');
const Game = require('../../models/game');
const HumanPlayer = require('../../models/humanPlayer');
const CpuPlayer = require('../../models/cpuPlayer');
const gameService = require('../../services/gameService');

const expect = chai.expect;

describe('Game', () => {
  it('Invalid player count (number < 1)', () => {
    expect(() => new Game(0)).to.throw('Invalid player count');
  });

  it('Player count exceeds', () => {
    let game = new Game(2);
    game.addPlayer(new CpuPlayer('cpu'));
    game.addPlayer(new CpuPlayer('cpu2'));
    expect(() => game.addPlayer(new CpuPlayer('cpu3'))).to.throw('The player number was exceeded');
  });

  it('Create game and add players: doesn\'t crash', () => {
    let game = new Game(2);
    game.addPlayer(new HumanPlayer('human'));
    game.addPlayer(new CpuPlayer('cpu'));
  });

  it('Validation successful for the first hit', () => {
    let game = gameService.createGame(false).game;
    let valid = game.validateHit(game._players[1].id, [ game._players[1].hand[0] ]);
    expect(valid).to.equal(true);
  });

  it('Validation successful: ace greater than two', () => {
    let game = gameService.createGame(false).game;
    let cardsToPlay = [ game._players[1].hand[0] ];
    game.validateHit(game._players[1].id, cardsToPlay);
    game.playTurn(cardsToPlay);
    let valid = game.validateHit(game._players[2].id, [ game._players[2].hand[6] ]);
    expect(valid).to.equal(true);
  });

  it('Validation unsuccessful: no cards given in the first hit', () => {
    let gameData = gameService.createGame();
    let valid = gameData.game.validateHit(gameData.player.id, []);
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful: hitting card that a player doesn\'t have', () => {
    let game = gameService.createGame(false).game;
    // Remove two of clubs from the hand
    let card = game._players[1].hand[0];
    game._players[1].hand.splice(0, 1);
    let valid = game.validateHit(game._players[1].id, [ card ]);
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful: equal value was hit', () => {
    let game = gameService.createGame(false).game;
    // Hit two of clubs
    let cardsToHit = [ game._players[1].hand[0] ];
    game.validateHit(game._players[1].id, cardsToHit);
    game.playTurn(cardsToHit);
    // Hit another two
    let valid = game.validateHit(game._players[2].id, [ game._players[2].hand[3] ]);
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful: less cards was hit', () => {
    let game = gameService.createGame(false).game;
    // Give another two for player 2
    let two = game._players[2].hand[3];
    game._players[2].hand.splice(3, 1);
    game._players[1].hand.push(two);

    // Hit 2 twos
    let cardsToHit = [ game._players[1].hand[0], game._players[1].hand[13] ];
    let valid = game.validateHit(game._players[1].id, cardsToHit);
    expect(valid).to.equal(true);
    game.playTurn(cardsToHit);
    // Hit only one ace
    valid = game.validateHit(game._players[2].id, [ game._players[2].hand[5] ]);
    expect(valid).to.equal(false);
  });

  it('Played card move from player\'s hand to the table', () => {
    let game = gameService.createGame(false).game;
    let player = game._players[1];
    expect(player.hand.length).to.equal(13);
    let card = player.hand[0];
    game.playTurn([ card ]);
    expect(player.hand.length).to.equal(12);
    expect(player.hand.indexOf(card)).to.equal(-1);
    expect(game._table.length).to.equal(1);
    expect(game._table[0]).to.equal(card);
  });

  it('Player turns are changed successfully', () => {
    let game = gameService.createGame(false).game;
    expect(game._turn).to.equal(game._players[1]);
    game.playTurn([ game._players[1].hand[0] ]);
    expect(game._turn).to.equal(game._players[2]);
    game.playTurn([ game._players[2].hand[0] ]);
    expect(game._turn).to.equal(game._players[3]);
    game.playTurn([ game._players[3].hand[0] ]);
    expect(game._turn).to.equal(game._players[0]);
  });
});
