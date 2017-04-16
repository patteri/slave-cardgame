const chai = require('chai');
const CardHelper = require('../../../common/cardHelper');
const Card = require('../../../common/card');

const expect = chai.expect;

describe('CardHelper', () => {
  it('Validation successful for the first hit (two of clubs required)', () => {
    let valid = CardHelper.validateHit([ new Card(Card.Suits.CLUBS, 2) ], [], true, false);
    expect(valid).to.equal(true);
  });

  it('Validation unsuccessful for the first hit: no cards given', () => {
    let valid = CardHelper.validateHit([], [], true, false);
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful for the first hit: two of clubs not given', () => {
    let valid = CardHelper.validateHit([ new Card(Card.Suits.SPADES, 2) ], [], true, false);
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful: no cards given on an empty table', () => {
    let valid = CardHelper.validateHit([], [], false, false);
    expect(valid).to.equal(false);
  });

  it('Validation successful: no cards given', () => {
    let valid = CardHelper.validateHit([], [ new Card(Card.Suits.CLUBS, 2) ], false, false);
    expect(valid).to.equal(true);
  });

  it('Validation successful: ace greater than two', () => {
    let valid = CardHelper.validateHit(
      [ new Card(Card.Suits.CLUBS, 1) ], [ new Card(Card.Suits.CLUBS, 2) ], false, false
    );
    expect(valid).to.equal(true);
  });

  it('Validation unsuccessful: equal value was hit', () => {
    let valid = CardHelper.validateHit(
      [ new Card(Card.Suits.SPADES, 2) ], [ new Card(Card.Suits.CLUBS, 2) ], false, false
    );
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful: less cards was hit', () => {
    let valid = CardHelper.validateHit(
      [ new Card(Card.Suits.SPADES, 1) ], [ new Card(Card.Suits.CLUBS, 2), new Card(Card.Suits.SPADES, 2) ], false,
      false
    );
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful in revolution: equal value was hit', () => {
    let valid = CardHelper.validateHit(
      [ new Card(Card.Suits.SPADES, 2) ], [ new Card(Card.Suits.CLUBS, 2) ], false, true
    );
    expect(valid).to.equal(false);
  });

  it('Validation unsuccessful in revolution: greater value was hit', () => {
    let valid = CardHelper.validateHit(
      [ new Card(Card.Suits.SPADES, 3) ], [ new Card(Card.Suits.CLUBS, 2) ], false, true
    );
    expect(valid).to.equal(false);
  });

  it('Validation successful in revolution: smaller value was hit', () => {
    let valid = CardHelper.validateHit(
      [ new Card(Card.Suits.SPADES, 2) ], [ new Card(Card.Suits.CLUBS, 3) ], false, true
    );
    expect(valid).to.equal(true);
  });
});
