const Player = require('./player');
const socketService = require('../services/socketService');

class HumanPlayer extends Player {

  notifyForCardExchange(cards, fromPlayer) {
    socketService.emitToClient(this._socket, 'cardsExchanged', {
      exchangedCards: {
        cards: cards,
        exchangeType: fromPlayer.cardExchangeRule.exchangeType,
        fromPlayer: fromPlayer.toShortJSON()
      },
      cards: this._hand
    });
  }

  toShortJSON() {
    return {
      name: this._name,
      isCpu: false
    };
  }

}

module.exports = HumanPlayer;
