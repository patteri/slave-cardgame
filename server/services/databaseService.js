const mongoose = require('mongoose');
const AppInfo = require('../datamodels/appInfo');
const User = require('../datamodels/user');
const UserStatistics = require('../datamodels/userStatistics');
const { initData, initDevData } = require('../datamodels/initialData');

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

  // Initializes the database
  static init() {
    return new Promise((resolve) => {
      AppInfo.findOne({}).exec().then((appInfo) => {
        if (appInfo == null) {
          return initData().then(() => {
            const appInfo = new AppInfo({
              databaseInitialized: true
            });
            return appInfo.save();
          }).then(() => resolve());
        }
        return resolve();
      });
    });
  }

  // Initializes development data
  static initDev() {
    return initDevData();
  }

  // Clears all contents of the database
  static clear() {
    if (process.env.NODE_ENV !== 'production') {
      return User.remove().exec()
        .then(() => UserStatistics.remove().exec())
        .then(() => AppInfo.remove().exec());
    }
    return Promise.resolve();
  }
}

module.exports = DatabaseService;
