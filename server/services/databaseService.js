const mongoose = require('mongoose');
const User = require('../datamodels/user');
const UserStatistics = require('../datamodels/userStatistics');
const authService = require('./authService');

let connection = null;

class DatabaseService {

  // Connects to the database
  static connect() {
    if (connection == null) {
      mongoose.Promise = Promise;
      const location = process.env.DB_LOCATION || 'mongodb://localhost/slave-dev';
      connection = mongoose.connect(location, { config: { autoIndex: false } });

      mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error: ', err); // eslint-disable-line no-console
      });
    }
  }

  // Closes the database connection
  static disconnect() {
    if (connection) {
      connection.disconnect();
    }
  }

  // Initializes development data
  static initDev() {
    return authService.register('admin', 'admin', 'admin@slavegame.net');
  }

  // Clears all contents of the database
  static clear() {
    if (process.env.NODE_ENV !== 'production') {
      return User.remove().exec().then(() => UserStatistics.remove().exec());
    }
    return Promise.resolve();
  }
}

module.exports = DatabaseService;
