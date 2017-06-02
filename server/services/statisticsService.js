const UserStatistics = require('../datamodels/userStatistics');

class StatisticsService {

  static recordGame(username, position, playerCount) {
    return UserStatistics.findOne({ username: username }).then((stats) => {
      if (stats) {
        stats.totalGames += 1;
        stats.totalGamePoints += (playerCount - position) / (playerCount - 1);
        stats.averageGamePoints = stats.totalGamePoints / stats.totalGames;

        if (position === 1) {
          stats.totalGameWins += 1;
          stats.currentWinningStreak += 1;
          if (stats.currentWinningStreak > stats.longestWinningStreak) {
            stats.longestWinningStreak = stats.currentWinningStreak;
          }
        }
        else {
          stats.currentWinningStreak = 0;
        }

        if (position === playerCount) {
          stats.totalGameLooses += 1;
          stats.currentLooseStreak += 1;
          if (stats.currentLooseStreak > stats.longestLooseStreak) {
            stats.longestLooseStreak = stats.currentLooseStreak;
          }
        }
        else {
          stats.currentLooseStreak = 0;
        }

        return stats.save();
      }
      return Promise.resolve();
    });
  }

  static recordTournament(username, position, playerCount, interrupted = false) {
    return UserStatistics.findOne({ username: username }).then((stats) => {
      if (stats) {
        stats.totalTournaments += 1;
        stats.totalTournamentPoints += (playerCount - position) / (playerCount - 1);
        stats.averageTournamentPoints = stats.totalTournamentPoints / stats.totalTournaments;
        if (interrupted) {
          stats.totalInterrupts += 1;
        }

        return stats.save();
      }
      return Promise.resolve();
    });
  }

  static listByProperty(property) {
    return UserStatistics.find({}, [ 'username', property ]).sort({ [property]: -1 }).limit(10).exec();
  }

  static getByUsername(username) {
    return UserStatistics.findOne({ username: username }).exec();
  }

}

module.exports = StatisticsService;
