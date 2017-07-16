// This script can be used for testing the computer AI
// The script makes CPU to play against itself

const _ = require('lodash');
const GameTracker = require('./gameTracker');
const CpuPlayer = require('../../models/cpuPlayer');

// Continuous: simulate games with card exchanges
// Single: simulate single games
const TestMethods = { CONTINUOUS: 'Continuous', SINGLE: 'Single' };
const TestMethod = TestMethods.CONTINUOUS;

// Number of games to simulate
const GameCount = 1000;

// Number of players in the simulation
const PlayerCount = 4;

// The AI parameters to to test
const firstPlayerConf = {
  applyHitDecisionLogic: true,
  minCardGroupCount: 4,
  minOpponentCardCount: 4,
  calculateAverageAfter: true,
  avgScaleFactor: 10,
  valueScaleFactor: 11
};

// AI parameters for the rest of the players
const otherPlayersConf = {
  applyHitDecisionLogic: false,
  minCardGroupCount: 4,
  minOpponentCardCount: 1,
  calculateAverageAfter: true,
  avgScaleFactor: 10,
  valueScaleFactor: 11
};

const startTime = Date.now();
console.log('Script started...'); // eslint-disable-line no-console

let scriptEnded = false;

const startGame = (gameCount, roundDone, done) => {
  let game = new GameTracker(PlayerCount, gameCount, roundDone, done);

  let specializedCpuPlayer = new CpuPlayer('CPU 1', firstPlayerConf);
  game.addPlayer(specializedCpuPlayer);

  for (let i = 1; i < PlayerCount; ++i) {
    let player = new CpuPlayer(`CPU ${i + 1}`, otherPlayersConf);
    game.addPlayer(player);
  }

  game.startNewGame();
};

let gameCounter = 0;
let results = null;
let deviation = new Map(_.times(PlayerCount, index => [ index, 0 ]));

if (TestMethod === TestMethods.CONTINUOUS) {
  const roundDone = (points) => {
    gameCounter += 1;

    let cpu1 = points.find(item => item.playerName === 'CPU 1');
    deviation.set(cpu1.points, deviation.get(cpu1.points) + 1);

    console.log(`${gameCounter} games simulated... CPU 1 points: ${cpu1.points}`); // eslint-disable-line no-console
  };

  const done = (points) => {
    results = _.orderBy(points, 'points', 'desc');
    scriptEnded = true;
  };

  startGame(GameCount, roundDone, done);
}
else {
  let resultsMap = new Map();

  const done = (points) => {
    points.forEach((item) => {
      let currentPoints = item.points;
      let existingPoints = resultsMap.get(item.playerName);
      let points = existingPoints === undefined ? currentPoints : existingPoints + currentPoints;
      resultsMap.set(item.playerName, points);
    });
    let cpu1 = points.find(item => item.playerName === 'CPU 1');
    deviation.set(cpu1.points, deviation.get(cpu1.points) + 1);

    gameCounter += 1;
    console.log(`${gameCounter} games simulated... CPU 1 points: ${cpu1.points}`); // eslint-disable-line no-console
    if (gameCounter === GameCount) {
      results = resultsMap;
      scriptEnded = true;
    }
    else {
      startGame(1, null, done);
    }
  };

  startGame(1, null, done);
}

(function wait() {
  if (!scriptEnded) {
    setTimeout(wait, 1000);
  }
  else {
    console.log(`Method: ${TestMethod}, game count: ${GameCount}, player count: ${PlayerCount}`); // eslint-disable-line no-console
    console.log('AI conf to test:', firstPlayerConf); // eslint-disable-line no-console
    console.log('AI conf to play against:', otherPlayersConf); // eslint-disable-line no-console
    console.log('Points:', results); // eslint-disable-line no-console
    console.log('Deviation:', deviation); // eslint-disable-line no-console
    console.log(`Script ended in ${(Date.now() - startTime) / 1000} seconds`); // eslint-disable-line no-console
  }
}());
