const Game = require('../../models/game');

// Extends the Game class by tracking and notifying a about the results of the played games
class GameTracker extends Game {

  constructor(playerCount, gameCount, roundDone, done) {
    super(playerCount, gameCount, true);

    this._roundDoneCallback = roundDone;
    this._doneCallback = done;
    this._playerPoints = new Map();

    this._configuration = {
      startCpuGameInterval: 0,
      startNewRoundInterval: 0
    };
  }

  gameEnded() {
    this._players.forEach((player) => {
      let currentPoints = this._players.length - player.position;
      let existingPoints = this._playerPoints.get(player.id);
      let points = existingPoints === undefined ? currentPoints : existingPoints + currentPoints;
      this._playerPoints.set(player.id, points);
    });

    if (this._roundDoneCallback) {
      this._roundDoneCallback(this._players.map(player => ({
        playerName: player.name,
        points: this._players.length - player.position
      })));
    }

    if (this._currentGameIndex === this._gameCount - 1) {
      if (this._doneCallback) {
        this._doneCallback(Array.from(this._playerPoints).map(([ key, value ]) => ({
          playerName: this._players.find(player => player.id === key).name,
          points: value
        })));
      }
    }

    super.gameEnded();
  }

}

module.exports = GameTracker;
