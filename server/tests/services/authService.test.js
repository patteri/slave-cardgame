const chai = require('chai');
const mongoose = require('mongoose');
const dbService = require('../../services/databaseService');
const authService = require('../../services/authService');

const expect = chai.expect;

describe('AuthService', () => {
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

  it('FindUserByToken: invalid JWT token', () => {
    const auth = authService.findUserByToken('invalid_token');
    expect(auth).to.be.null; // eslint-disable-line no-unused-expressions
  });

  it('FindUserByToken: invalid user in a valid JWT token', (done) => {
    const token = authService.generateAuthToken({ username: 'not_existing' });
    authService.findUserByToken(token).then((user) => {
      expect(user).to.be.null; // eslint-disable-line no-unused-expressions
      done();
    });
  });

  it('FindUserByToken: successfull', (done) => {
    const token = authService.generateAuthToken({ username: 'admin' });
    authService.findUserByToken(token).then((user) => {
      expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
      expect(user.username).to.equal('admin');
      done();
    });
  });

  it('FindUserByCredentials: invalid credentials', (done) => {
    authService.findUserByCredentials('admin', 'invalid password').then((user) => {
      expect(user).to.be.null; // eslint-disable-line no-unused-expressions
      done();
    });
  });

  it('FindUserByCredentials: successfull', (done) => {
    authService.findUserByCredentials('admin', 'admin').then((user) => {
      expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
      expect(user.username).to.equal('admin');
      done();
    });
  });

  it('Successfull registration', (done) => {
    authService.register('user', 'password', 'user@slavegame.net').then(() => {
      authService.findUserByCredentials('user', 'password').then((user) => {
        expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
        done();
      });
    });
  });
});
