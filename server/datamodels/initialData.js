const UserStatistics = require('./userStatistics');
const authService = require('../services/authService');

exports.initDevData = () =>
  authService.register('admin', 'admin', 'admin@slavegame.net')
    .then(() => {
      const userStats = [
        new UserStatistics({
          username: 'player 1',
          totalGames: 100,
          averageGamePoints: 0.9,
          averageTournamentPoints: 0.821,
          longestWinningStreak: 7,
          longestLooseStreak: 5
        }),
        new UserStatistics({
          username: 'player 2',
          totalGames: 101,
          averageGamePoints: 0.8,
          averageTournamentPoints: 0.6,
          longestWinningStreak: 5,
          longestLooseStreak: 6
        }),
        new UserStatistics({
          username: 'player 3',
          totalGames: 102,
          averageGamePoints: 0.7,
          averageTournamentPoints: 0.695,
          longestWinningStreak: 6,
          longestLooseStreak: 7
        })
      ];
      return UserStatistics.insertMany(userStats);
    });
