const mongoose = require('mongoose');

const userStatisticsSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true }, // Reference to user schema
  totalGames: { type: Number, required: true, default: 0 },
  totalGamePoints: { type: Number, required: true, default: 0 },
  averageGamePoints: { type: Number, required: true, default: 0 },
  totalGameWins: { type: Number, required: true, default: 0 },
  totalGameLooses: { type: Number, required: true, default: 0 },
  totalTournaments: { type: Number, required: true, default: 0 },
  totalTournamentPoints: { type: Number, required: true, default: 0 },
  averageTournamentPoints: { type: Number, required: true, default: 0 },
  totalInterrupts: { type: Number, required: true, default: 0 },
  currentWinningStreak: { type: Number, required: true, default: 0 },
  longestWinningStreak: { type: Number, required: true, default: 0 },
  currentLooseStreak: { type: Number, required: true, default: 0 },
  longestLooseStreak: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('UserStatistics', userStatisticsSchema);
