const Player = require('./player');

const AIInterval = 2000;

class CpuPlayer extends Player {

  playTurn(game) {
    setTimeout((game) => {
      game.playTurn([ this.hand[0] ]);
    }, AIInterval, game);
  }

}

module.exports = CpuPlayer;
