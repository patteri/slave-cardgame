const chai = require('chai');
const mongoose = require('mongoose');
const dbService = require('../../services/databaseService');
const AppInfo = require('../../datamodels/appInfo');

const expect = chai.expect;

describe('DatabaseService', () => {
  before((done) => {
    if (mongoose.connection.readyState === 0) {
      dbService.connect();
    }
    dbService.clear()
      .then(() => dbService.init())
      .then(() => {
        done();
      });
  });

  it('Database is initialized only once', (done) => {
    AppInfo.find({}).exec()
      .then((result) => {
        expect(result).to.not.be.null; // eslint-disable-line no-unused-expressions
        expect(result.length).to.equal(1);
        return dbService.init();
      })
      .then(() => AppInfo.find({}).exec())
      .then((result) => {
        expect(result.length).to.equal(1);
        done();
      });
  });
});
