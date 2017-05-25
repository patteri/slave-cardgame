const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../datamodels/user');

let connection = null;

class DatabaseService {

  // Connects to the database
  static connect() {
    if (connection == null) {
      mongoose.Promise = Promise;
      const location = process.env.DB_LOCATION || 'mongodb://localhost/slave-dev';
      connection = mongoose.connect(location);

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
    const user = new User({
      username: 'admin',
      email: 'admin@slavegame.net',
      password: crypto.createHash('sha256').update('admin').digest('hex')
    });
    user.save();
  }

  // Clears all contents of the database
  static clear() {
    if (process.env.NODE_ENV !== 'production') {
      User.remove().exec();
    }
  }
}

module.exports = DatabaseService;
