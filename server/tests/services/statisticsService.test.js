const chai = require('chai');
const mongoose = require('mongoose');
const dbService = require('../../services/databaseService');
const statisticsService = require('../../services/statisticsService');

const expect = chai.expect;

describe('StatisticsService', () => {
  before((done) => {
    if (mongoose.connection.readyState === 0) {
      dbService.connect();
    }
    dbService.clear()
      .then(() => dbService.initDev())
      .then(() => {
        done();
      });
  });

  it('Game records', (done) => {
    statisticsService.recordGame('admin', 1, 4).then((stats) => {
      expect(stats).not.to.be.null; // eslint-disable-line no-unused-expressions
      expect(stats.totalGames).to.equal(1);
      expect(stats.totalGamePoints).to.equal(1);
      expect(stats.averageGamePoints).to.equal(1);
      expect(stats.totalGameWins).to.equal(1);
      expect(stats.totalGameLooses).to.equal(0);
      expect(stats.currentWinningStreak).to.equal(1);
      expect(stats.longestWinningStreak).to.equal(1);
      expect(stats.currentLooseStreak).to.equal(0);
      expect(stats.longestLooseStreak).to.equal(0);

      return statisticsService.recordGame('admin', 4, 4);
    }).then((stats) => {
      expect(stats.totalGames).to.equal(2);
      expect(stats.totalGamePoints).to.equal(1);
      expect(stats.averageGamePoints).to.equal(0.5);
      expect(stats.totalGameWins).to.equal(1);
      expect(stats.totalGameLooses).to.equal(1);
      expect(stats.currentWinningStreak).to.equal(0);
      expect(stats.longestWinningStreak).to.equal(1);
      expect(stats.currentLooseStreak).to.equal(1);
      expect(stats.longestLooseStreak).to.equal(1);

      return statisticsService.recordGame('admin', 1, 4);
    }).then((stats) => {
      expect(stats.totalGames).to.equal(3);
      expect(stats.totalGamePoints).to.equal(2);
      expect(stats.averageGamePoints).to.equal(2 / 3);
      expect(stats.totalGameWins).to.equal(2);
      expect(stats.totalGameLooses).to.equal(1);
      expect(stats.currentWinningStreak).to.equal(1);
      expect(stats.longestWinningStreak).to.equal(1);
      expect(stats.currentLooseStreak).to.equal(0);
      expect(stats.longestLooseStreak).to.equal(1);

      done();
    });
  });

  it('Tournament records', (done) => {
    statisticsService.recordTournament('admin', 1, 4).then((stats) => {
      expect(stats).not.to.be.null; // eslint-disable-line no-unused-expressions
      expect(stats.totalTournaments).to.equal(1);
      expect(stats.totalTournamentPoints).to.equal(1);
      expect(stats.averageTournamentPoints).to.equal(1);
      expect(stats.totalInterrupts).to.equal(0);

      return statisticsService.recordTournament('admin', 4, 4, true);
    }).then((stats) => {
      expect(stats.totalTournaments).to.equal(2);
      expect(stats.totalTournamentPoints).to.equal(1);
      expect(stats.averageTournamentPoints).to.equal(0.5);
      expect(stats.totalInterrupts).to.equal(1);

      done();
    });
  });

  it('List by property', (done) => {
    statisticsService.listByProperty('totalGames').then((stats) => {
      expect(stats.length).to.equal(4);
      expect(stats[0]).to.have.property('username');
      expect(stats[0]).to.have.property('totalGames');
      expect(stats[0].username).to.equal('player 3');
      expect(stats[1].username).to.equal('player 2');
      expect(stats[2].username).to.equal('player 1');

      return statisticsService.listByProperty('averageGamePoints');
    }).then((stats) => {
      expect(stats[0]).to.have.property('username');
      expect(stats[0]).to.have.property('averageGamePoints');
      expect(stats[0].username).to.equal('player 1');
      expect(stats[1].username).to.equal('player 2');
      expect(stats[2].username).to.equal('player 3');

      done();
    });
  });
});
