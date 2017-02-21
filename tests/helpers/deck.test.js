const chai = require('chai');
const _ = require('lodash');
const Deck = require('../../helpers/deck');

const expect = chai.expect;

describe('Deck', () => {
  it('Doesn\'t crash and has 52 cards', () => {
    let deck = new Deck();
    expect(deck.deck).to.be.an('array');
    expect(deck.deck.length).to.equal(52);
  });

  it('Shuffle and initialize', () => {
    let deck = new Deck();
    let deck2 = new Deck();
    let equals = _.isEqual(deck.deck, deck2.deck);
    expect(equals).to.equal(true);

    deck2.shuffle();
    equals = _.isEqual(deck.deck, deck2.deck);
    expect(equals).to.equal(false);

    deck2.initialize();
    equals = _.isEqual(deck.deck, deck2.deck);
    expect(equals).to.equal(true);
  });
});