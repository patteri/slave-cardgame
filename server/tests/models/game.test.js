const chai = require('chai');
const _ = require('lodash');
const Game = require('../../models/game');
const Card = require('../../../common/card');
const HumanPlayer = require('../../models/humanPlayer');
const CpuPlayer = require('../../models/cpuPlayer');
const gameService = require('../../services/gameService');
const CardHelper = require('../../../common/cardHelper');
const { CardExchangeType } = require('../../../common/constants');

const expect = chai.expect;

const createEndedGame = () => {
  let game = gameService.createGame().game;
  game._players[0].position = 1;
  game._players[1].position = 2;
  game._players[2].position = 3;
  game._players[3].position = 4;
  game.gameEnded();
  return game;
};

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

  it('Validation unsuccessful: hitting the same card twice', () => {
    let game = gameService.createGame(false).game;
    let card = game._players[1].hand[0];
    let valid = game.validateHit(game._players[1].id, [ card, card ]);
    expect(valid).to.equal(false);
  });

  it('Played card is moved from player\'s hand to the table', () => {
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

  it('Card exchange rule works correctly', () => {
    let game = createEndedGame();
    expect(game._players[0].cardExchangeRule.exchangeCount).to.equal(2);
    expect(game._players[1].cardExchangeRule.exchangeCount).to.equal(1);
    expect(game._players[2].cardExchangeRule.exchangeCount).to.equal(1);
    expect(game._players[3].cardExchangeRule.exchangeCount).to.equal(2);
    expect(game._players[0].cardExchangeRule.exchangeType).to.equal(CardExchangeType.FREE);
    expect(game._players[1].cardExchangeRule.exchangeType).to.equal(CardExchangeType.FREE);
    expect(game._players[2].cardExchangeRule.exchangeType).to.equal(CardExchangeType.BEST);
    expect(game._players[3].cardExchangeRule.exchangeType).to.equal(CardExchangeType.BEST);
    expect(game._players[0].cardExchangeRule.toPlayer.id).to.equal(game._players[3].id);
    expect(game._players[1].cardExchangeRule.toPlayer.id).to.equal(game._players[2].id);
    expect(game._players[2].cardExchangeRule.toPlayer.id).to.equal(game._players[1].id);
    expect(game._players[3].cardExchangeRule.toPlayer.id).to.equal(game._players[0].id);
  });

  it('Card exchange rule works correctly 2', () => {
    let game = gameService.createGame().game;
    game._players[0].position = 2;
    game._players[1].position = 4;
    game._players[2].position = 1;
    game._players[3].position = 3;
    game.gameEnded();
    expect(game._players[0].cardExchangeRule.exchangeCount).to.equal(1);
    expect(game._players[1].cardExchangeRule.exchangeCount).to.equal(2);
    expect(game._players[2].cardExchangeRule.exchangeCount).to.equal(2);
    expect(game._players[3].cardExchangeRule.exchangeCount).to.equal(1);
    expect(game._players[0].cardExchangeRule.exchangeType).to.equal(CardExchangeType.FREE);
    expect(game._players[1].cardExchangeRule.exchangeType).to.equal(CardExchangeType.BEST);
    expect(game._players[2].cardExchangeRule.exchangeType).to.equal(CardExchangeType.FREE);
    expect(game._players[3].cardExchangeRule.exchangeType).to.equal(CardExchangeType.BEST);
    expect(game._players[0].cardExchangeRule.toPlayer.id).to.equal(game._players[3].id);
    expect(game._players[1].cardExchangeRule.toPlayer.id).to.equal(game._players[2].id);
    expect(game._players[2].cardExchangeRule.toPlayer.id).to.equal(game._players[1].id);
    expect(game._players[3].cardExchangeRule.toPlayer.id).to.equal(game._players[0].id);
  });

  it('Set cards for exchange unsuccessful: try to exchange twice', () => {
    let game = createEndedGame();

    let success = game.setCardsForExchange(game._players[0].id, [ game._players[0].hand[0], game._players[0].hand[1] ]);
    expect(success).to.equal(true);
    success = game.setCardsForExchange(game._players[0].id, [ game._players[0].hand[0], game._players[0].hand[1] ]);
    expect(success).to.equal(false);
  });

  it('Set cards for exchange unsuccessful: card doesn\'t exist', () => {
    let game = createEndedGame();

    let card = game._players[0].hand[0];
    game._players[0].hand.splice(0, 1);

    let success = game.setCardsForExchange(game._players[0].id, [ card, game._players[0].hand[1] ]);
    expect(success).to.equal(false);
  });

  it('Set cards for exchange unsuccessful: wrong card count', () => {
    let game = createEndedGame();

    let success = game.setCardsForExchange(game._players[0].id, [ game._players[0].hand[0] ]);
    expect(success).to.equal(false);
  });

  it('Set cards for exchange unsuccessful: best card not given', () => {
    let game = gameService.createGame().game;
    game._players[0].position = 3;
    game._players[1].position = 4;
    game._players[2].position = 1;
    game._players[3].position = 2;
    game.gameEnded();

    let success = game.setCardsForExchange(game._players[0].id,
      [ game._players[0].hand.sort(CardHelper.compareCards)[0] ]);
    expect(success).to.equal(false);
  });

  it('Set cards for exchange (free cards) successful', () => {
    let game = createEndedGame();

    let success = game.setCardsForExchange(game._players[0].id, [ game._players[0].hand[0], game._players[0].hand[1] ]);
    expect(success).to.equal(true);
  });

  it('Set cards for exchange (best cards) successful', () => {
    let game = gameService.createGame().game;
    game._players[0].position = 4;
    game._players[1].position = 3;
    game._players[2].position = 2;
    game._players[3].position = 1;
    game.gameEnded();

    let success = game.setCardsForExchange(game._players[0].id,
      _.takeRight(game._players[0].hand.sort(CardHelper.compareCards), 2));
    expect(success).to.equal(true);
  });
});
