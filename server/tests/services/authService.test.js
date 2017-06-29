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
      .then(() => dbService.init())
      .then(() => dbService.initDev())
      .then(() => {
        done();
      });
  });

  it('FindUserByToken: invalid JWT token', (done) => {
    authService.findUserByToken('invalid_token').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('FindUserByToken: invalid user in a valid JWT token', (done) => {
    const token = authService.generateAuthToken({ username: 'not_existing' }).token;
    authService.findUserByToken(token).then((user) => {
      expect(user).to.be.null; // eslint-disable-line no-unused-expressions
      done();
    });
  });

  it('FindUserByToken: successfull', (done) => {
    const token = authService.generateAuthToken({ username: 'admin' }).token;
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

  it('Cannot login as a computer', (done) => {
    authService.findUserByCredentials('Computer 1', 'password').then((user) => {
      expect(user).to.be.null; // eslint-disable-line no-unused-expressions
      done();
    });
  });

  it('Order password renewal: invalid email', (done) => {
    authService.orderPasswordRenewal('not_found').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Order password renewal: successfull', (done) => {
    authService.orderPasswordRenewal('admin@slavegame.net').then(() => {
      done();
    });
  });

  it('Change password: invalid user', (done) => {
    const token = authService.generateForgotPasswordToken('not_existing').token;
    authService.changePassword(token, 'newpassword').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Change password: invalid token', (done) => {
    authService.changePassword('invalid_token', 'newpassword').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Change password: successfull', (done) => {
    const token = authService.generateForgotPasswordToken('admin').token;
    authService.changePassword(token, 'newpassword')
      .then(() => authService.findUserByCredentials('admin', 'newpassword'))
      .then((user) => {
        expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Generate random token', () => {
    let result = authService.generateRandomToken(16);
    expect(result).to.not.be.null; // eslint-disable-line no-unused-expressions
    expect(result.length).to.equal(16);
    result = authService.generateRandomToken(17);
    expect(result.length).to.equal(16);
    result = authService.generateRandomToken(18);
    expect(result.length).to.equal(18);
  });
});
