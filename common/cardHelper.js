const Card = require('./card');

class CardHelper {

  // Tries to find two of clubs from the given cards
  // If not found, returns undefined
  static findTwoOfClubs(cards) {
    return cards.find(item => item.suit === Card.Suits.CLUBS && item.value === 2);
  }

  // Validates the hit against game rules
  static validateHit(cards, previousHit, isFirstTurn, isRevolution) {
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
      if (previousValue === 1 ||
        (CardHelper.compareGreatness(previousValue, firstValue, isRevolution) && firstValue !== 1) ||
        (cards.length < previousHit.length)) {
        return false;
      }
    }

    return true;
  }

  // Compares cards' greatness
  // Takes into account the revolution rule
  static compareGreatness(value1, value2, isRevolution) {
    return isRevolution ? value1 <= value2 : value1 >= value2;
  }

  // Compares cards' absolute values.
  // The function assumes that Ace (value == 1) is the greatest card.
  // The function can be used for sorting the deck
  static compareCards(first, second) {
    if (first.value === second.value) {
      return first.suit.localeCompare(second.suit);
    }
    if (first.value === 1) {
      return 1;
    }
    else if (second.value === 1) {
      return -1;
    }
    return first.value - second.value;
  }

  static getRealValue(card, isRevolution) {
    if (!isRevolution && card.value === 1) {
      return 14;
    }
    return card.value;
  }

}

module.exports = CardHelper;
