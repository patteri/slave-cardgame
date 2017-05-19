const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../datamodels/user');

class DatabaseService {

  // Connects to the database
  static connect() {
    mongoose.Promise = Promise;
    const location = process.env.DB_LOCATION || 'mongodb://localhost/slave-dev';
    mongoose.connect(location);

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error: ', err); // eslint-disable-line no-console
    });
  }

  // Closes the database connection
  static disconnect() {
    mongoose.disconnect();
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
      User.remove();
    }
  }
}

module.exports = DatabaseService;
