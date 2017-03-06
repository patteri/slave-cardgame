const chai = require('chai');
const Game = require('../../models/game');
const Card = require('../../models/card');
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

  it('Validation unsuccessful: hitting card that a player doesn\'t have', () => {
    let game = gameService.createGame(false).game;
    // Remove two of clubs from the hand
    let card = game._players[1].hand[0];
    game._players[1].hand.splice(0, 1);
    let valid = game.validateHit(game._players[1].id, [ card ]);
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

  it('Hitting four cards with same value leads to the revolution', () => {
    let game = gameService.createGame(false).game;
    let player = game._players[1]; // Player at index 1 has the two of clubs and is in turn
    let card2 = new Card(Card.Suits.SPADES, 2);
    player.hand.push(card2);
    let card3 = new Card(Card.Suits.HEARTS, 2);
    player.hand.push(card3);
    let card4 = new Card(Card.Suits.DIAMONDS, 2);
    player.hand.push(card4);
    game.playTurn([ game._players[1].hand[0], card2, card3, card4 ]);
    expect(game.isRevolution()).to.equal(true);
  });
});
