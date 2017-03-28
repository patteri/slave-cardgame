const Game = require('../../models/game');

// Extends the Game class by tracking and notifying a about the results of the played games
class GameTracker extends Game {

  constructor(playerCount, gameCount, roundDone, done) {
    super(playerCount, true);

    this._gameCount = gameCount;
    this._gameIndex = 0;
    this._roundDoneCallback = roundDone;
    this._doneCallback = done;
    this._playerPoints = new Map();

    this._configuration = {
      startCpuGameInterval: 0,
      startNewRoundInterval: 0
    };
  }

  exchangeCards(players) {
    players.forEach((player) => {
      let currentPoints = players.length - player.position;
      let existingPoints = this._playerPoints.get(player.id);
      let points = existingPoints === undefined ? currentPoints : existingPoints + currentPoints;
      this._playerPoints.set(player.id, points);
    });

    if (this._roundDoneCallback) {
      this._roundDoneCallback(players.map(player => ({
        playerName: player.name,
        points: players.length - player.position
      })));
    }

    this._gameIndex += 1;
    if (this._gameIndex === this._gameCount) {
      if (this._doneCallback) {
        this._doneCallback(Array.from(this._playerPoints).map(([ key, value ]) => ({
          playerName: this._players.find(player => player.id === key).name,
          points: value
        })));
      }
    }
    else {
      super.exchangeCards(players);
    }
  }

}

module.exports = GameTracker;
