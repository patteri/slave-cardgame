const User = require('./user');
const UserStatistics = require('./userStatistics');
const authService = require('../services/authService');

exports.initData = () => {
  const cpus = [];
  for (let i = 1; i <= 10; ++i) {
    cpus.push(new User({
      username: `Computer ${i}`,
      password: 'password',
      email: 'email',
      active: false
    }));
  }
  return User.insertMany(cpus);
};

exports.initDevData = () =>
  authService.register('admin', 'admin', 'admin@slavegame.net', true)
    .then(() => {
      const userStats = [
        new UserStatistics({
          username: 'player 1',
          totalGames: 100,
          totalTournaments: 10,
          averageGamePoints: 0.9,
          averageTournamentPoints: 0.821,
          longestWinningStreak: 7,
          longestLooseStreak: 5
        }),
        new UserStatistics({
          username: 'player 2',
          totalGames: 101,
          totalTournaments: 10,
          averageGamePoints: 0.8,
          averageTournamentPoints: 0.6,
          longestWinningStreak: 5,
          longestLooseStreak: 6
        }),
        new UserStatistics({
          username: 'player 3',
          totalGames: 102,
          totalTournaments: 11,
          averageGamePoints: 0.7,
          averageTournamentPoints: 0.695,
          longestWinningStreak: 6,
          longestLooseStreak: 7
        }),
        new UserStatistics({
          username: 'player 4',
          totalGames: 40,
          totalTournaments: 4,
          averageGamePoints: 0.65,
          averageTournamentPoints: 0.55,
          longestWinningStreak: 3,
          longestLooseStreak: 4
        })
      ];
      return UserStatistics.insertMany(userStats);
    });
