const Card = require('../models/card');

class CardHelper {

  // Tries to find two of clubs from the given cards
  // If not found, returns undefined
  static findTwoOfClubs(cards) {
    return cards.find(item => item.suit === Card.Suits.CLUBS && item.value === 2);
  }

  // Validates the hit against game rules
  static validateHit(cards, previousHit, isFirstTurn) {
    // First hit of the game must contain the two of clubs
    if (isFirstTurn) {
      if (CardHelper.findTwoOfClubs(cards) === undefined) {
        return false;
      }
    }

    // No cards is a valid hit if it wasn't the first hit of the game
    if (cards.length === 0) {
      return true;
    }

    // If multiple cards was hit, they must be the same value
    const firstValue = cards[0].value;
    for (let i = 1; i < cards.length; ++i) {
      if (cards[i].value !== firstValue) {
        return false;
      }
    }

    // The value must be greater and the card count at least as high as in the previous hit
    if (previousHit.length > 0) {
      let previousValue = previousHit[0].value;
      if (previousValue === 1 || (previousValue >= firstValue && firstValue !== 1) ||
        (cards.length < previousHit.length)) {
        return false;
      }
    }

    return true;
  }

}

module.exports = CardHelper;
