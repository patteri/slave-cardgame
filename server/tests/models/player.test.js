const chai = require('chai');
const HumanPlayer = require('../../models/humanPlayer');
const CpuPlayer = require('../../models/cpuPlayer');
const Card = require('../../../common/card');
const Deck = require('../../models/deck');
const { CardExchangeType } = require('../../../common/constants');

const expect = chai.expect;

describe('Player', () => {
  it('Valid human player', () => {
    const name = 'human';
    let player = new HumanPlayer(name);
    expect(player.name).to.equal(name);
  });

  it('Valid cpu player', () => {
    const name = 'cpu';
    let player = new CpuPlayer(name);
    expect(player.name).to.equal(name);
  });

  it('Hit smallest card', () => {
    let player = new CpuPlayer('Computer');
    player.hand = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.CLUBS, value: 2 },
      { suit: Card.Suits.CLUBS, value: 3 }
    ];
    let cards = player.getNextCardsToPlay([], false, []);
    expect(cards.length).to.equal(1);
    expect(cards[0].value).to.equal(2);
  });

  it('Get key of best remaining value', () => {
    let player = new CpuPlayer('Computer');
    let key = player.getKeyOfBestRemainingValue([], false);
    expect(key).to.equal('14');
  });

  it('Get key of best remaining value 2', () => {
    let player = new CpuPlayer('Computer');
    let tableCards = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.DIAMONDS, value: 1 },
      { suit: Card.Suits.HEARTS, value: 1 },
      { suit: Card.Suits.SPADES, value: 1 }
    ];
    let key = player.getKeyOfBestRemainingValue(tableCards, false);
    expect(key).to.equal('13');
  });

  it('Get key of best remaining value 3', () => {
    let player = new CpuPlayer('Computer');
    let tableCards = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.DIAMONDS, value: 1 },
      { suit: Card.Suits.HEARTS, value: 1 },
      { suit: Card.Suits.SPADES, value: 1 }
    ];
    let key = player.getKeyOfBestRemainingValue(tableCards, true);
    expect(key).to.equal('02');
  });

  it('Hit better card if having the best card and only two cards left on the table', () => {
    let player = new CpuPlayer('Computer');
    player.hand = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.CLUBS, value: 2 }
    ];
    let cards = player.getNextCardsToPlay([], false, []);
    expect(cards.length).to.equal(1);
    expect(cards[0].value).to.equal(1);
  });

  it('Hit better card if having the best card and only two cards left on the table (revolution)', () => {
    let player = new CpuPlayer('Computer');
    player.hand = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.CLUBS, value: 2 }
    ];
    let cards = player.getNextCardsToPlay([], true, []);
    expect(cards.length).to.equal(1);
    expect(cards[0].value).to.equal(1);
  });

  it('If opponent has only one card left, don\'t hit the smallest hand, if possible', () => {
    let player = new CpuPlayer('Computer');
    let deck = new Deck();
    // Set two cards to player's hand and one for the opponent
    player.hand = [
      deck.deck[1],
      deck.deck[2]
    ];
    deck.deck.splice(0, 3); // "Give" the first card to the other player
    let cards = player.getNextCardsToPlay([], false, deck.deck);
    expect(cards.length).to.equal(1);
    expect(cards[0].value).to.equal(3);
  });

  it('If opponent has only one card left, don\'t hit the smallest hand, if possible (revolution)', () => {
    let player = new CpuPlayer('Computer');
    let deck = new Deck();
    // Set two cards to player's hand and one for the opponent
    player.hand = [
      deck.deck[1],
      deck.deck[2]
    ];
    deck.deck.splice(0, 3); // "Give" the first card to the other player
    let cards = player.getNextCardsToPlay([], true, deck.deck);
    expect(cards.length).to.equal(1);
    expect(cards[0].value).to.equal(2);
  });

  it('Give best cards only the needed count, if cards with different values > 2', () => {
    let player = new CpuPlayer('Computer');
    // Set two cards to player's hand and one for the opponent
    player.hand = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.SPADES, value: 1 },
      { suit: Card.Suits.SPADES, value: 13 },
      { suit: Card.Suits.SPADES, value: 12 }
    ];
    let previousHit = [
      { suit: Card.Suits.CLUBS, value: 13 }
    ];
    let cards = player.getNextCardsToPlay(previousHit, true, []);
    expect(cards.length).to.equal(1);
  });

  it('Give best cards only the needed count, if cards with different values > 2', () => {
    let player = new CpuPlayer('Computer');
    // Set two cards to player's hand and one for the opponent
    player.hand = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.HEARTS, value: 1 },
      { suit: Card.Suits.SPADES, value: 1 },
      { suit: Card.Suits.SPADES, value: 13 },
      { suit: Card.Suits.SPADES, value: 12 }
    ];
    let previousHit = [
      { suit: Card.Suits.CLUBS, value: 13 },
      { suit: Card.Suits.HEARTS, value: 13 }
    ];
    let cards = player.getNextCardsToPlay(previousHit, true, []);
    expect(cards.length).to.equal(2);
  });

  it('Select free cards for exchange', () => {
    let player = new CpuPlayer('Computer');
    player.hand = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.CLUBS, value: 2 },
      { suit: Card.Suits.CLUBS, value: 3 },
      { suit: Card.Suits.SPADES, value: 3 },
      { suit: Card.Suits.CLUBS, value: 4 },
      { suit: Card.Suits.CLUBS, value: 5 }
    ];
    player.cardExchangeRule = {
      exchangeCount: 2,
      exchangeType: CardExchangeType.FREE
    };
    let cards = player.selectCardsForExchange(false);
    expect(cards.length).to.equal(2);
    expect(cards.find(item => item.value === 4)).to.not.equal(undefined);
    expect(cards.find(item => item.value === 5)).to.not.equal(undefined);
  });

  it('Select free cards for exchange 2', () => {
    let player = new CpuPlayer('Computer');
    player.hand = [
      { suit: Card.Suits.CLUBS, value: 1 },
      { suit: Card.Suits.CLUBS, value: 2 },
      { suit: Card.Suits.CLUBS, value: 3 },
      { suit: Card.Suits.SPADES, value: 3 },
      { suit: Card.Suits.CLUBS, value: 4 },
      { suit: Card.Suits.CLUBS, value: 6 },
      { suit: Card.Suits.SPADES, value: 6 }
    ];
    player.cardExchangeRule = {
      exchangeCount: 2,
      exchangeType: CardExchangeType.FREE
    };
    let cards = player.selectCardsForExchange(false);
    expect(cards.length).to.equal(2);
    expect(cards.find(item => item.value === 4)).to.not.equal(undefined);
    expect(cards.find(item => item.value === 3)).to.not.equal(undefined);
  });
});
