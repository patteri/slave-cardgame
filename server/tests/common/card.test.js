const chai = require('chai');
const Card = require('../../../client/src/shared/card');

const expect = chai.expect;

describe('Card', () => {
  it('Invalid suit', () => {
    expect(() => new Card('invalid', 1)).to.throw('Invalid suit');
  });

  it('Invalid value (not a number)', () => {
    expect(() => new Card(Card.Suits.SPADES, 'a')).to.throw('Invalid value');
  });

  it('Invalid value (number < 1)', () => {
    expect(() => new Card(Card.Suits.SPADES, 0)).to.throw('Invalid value');
  });

  it('Invalid value (number > 13)', () => {
    expect(() => new Card(Card.Suits.SPADES, 14)).to.throw('Invalid value');
  });

  it('Valid card (ace of spades)', () => {
    let card = new Card(Card.Suits.SPADES, 1);
    expect(card.suit).to.equal(Card.Suits.SPADES);
    expect(card.value).to.equal(1);
  });

  it('Valid card (king of diamonds)', () => {
    let card = new Card(Card.Suits.DIAMONDS, 13);
    expect(card.suit).to.equal(Card.Suits.DIAMONDS);
    expect(card.value).to.equal(13);
  });
});
