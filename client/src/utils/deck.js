import Card from '../shared/card';

// Gives access to preloaded card images
class Deck {
  constructor() {
    this.cards = new Map();
  }
  
  loadCards = () => {
    Object.values(Card.Suits).forEach((suitKey) => {
      for (let i = 1; i < 14; ++i) {
        const src = `/images/cards/${suitKey.toLowerCase()}-${i}-150.png`;
        const img = document.createElement('img');
        img.src = src;
        this.cards.set(`${suitKey}${i}`, img);
      }
    });
  }

  getCard = (card) => this.cards.get(`${card.suit}${card.value}`);
}

const deck = new Deck();

export default deck;
