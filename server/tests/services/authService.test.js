const chai = require('chai');
const mongoose = require('mongoose');
const dbService = require('../../services/databaseService');
const authService = require('../../services/authService');
const statisticsService = require('../../services/statisticsService');

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
    authService.findUserByToken(token).then(() => {
    }).catch(() => {
      done();
    });
  });

  it('FindUserByToken: successful', (done) => {
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

  it('FindUserByCredentials: successful', (done) => {
    authService.findUserByCredentials('admin', 'admin').then((user) => {
      expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
      expect(user.username).to.equal('admin');
      done();
    });
  });

  it('Successful registration', (done) => {
    authService.register('user', 'password', 'user@slavegame.net', true).then(() => {
      authService.findUserByCredentials('user', 'password').then((user) => {
        expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
        done();
      });
    });
  });

  it('Cannot login if user not activated', (done) => {
    authService.register('user2', 'password', 'user2@slavegame.net').then(() => {
      authService.findUserByCredentials('user2', 'password').then((user) => {
        expect(user).to.be.null; // eslint-disable-line no-unused-expressions
        done();
      });
    });
  });

  it('Activate: invalid user', (done) => {
    const token = authService.generateAccountActivationToken('not_existing').token;
    authService.activate(token).then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Activate: invalid token', (done) => {
    authService.activate('invalid_token').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Activate: successful', (done) => {
    authService.register('user3', 'password', 'user3@slavegame.net')
      .then(() => {
        const token = authService.generateAccountActivationToken('user3').token;
        return authService.activate(token);
      })
      .then(() => authService.findUserByCredentials('user3', 'password'))
      .then((user) => {
        expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Remove: invalid token', (done) => {
    authService.remove('invalid_token').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Remove: successful', (done) => {
    authService.register('user4', 'password', 'user4@slavegame.net', true).then(() => {
      const token = authService.generateAuthToken({ username: 'user4' }).token;
      authService.remove(token)
        .then(() => authService.findUserByCredentials('user4', 'password'))
        .then((user) => {
          expect(user).to.be.null; // eslint-disable-line no-unused-expressions
          done();
        });
    });
  });

  it('Order password renewal: invalid email', (done) => {
    authService.orderPasswordRenewal('not_found').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Order password renewal: successful', (done) => {
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

  it('Change password: successful', (done) => {
    const token = authService.generateForgotPasswordToken('admin').token;
    authService.changePassword(token, 'newpassword')
      .then(() => authService.findUserByCredentials('admin', 'newpassword'))
      .then((user) => {
        expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Change username: invalid user', (done) => {
    const token = authService.generateAuthToken({ username: 'not_existing' }).token;
    authService.changeUsername(token, 'newusername').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Change username: invalid token', (done) => {
    authService.changeUsername('invalid_token', 'newusername').then(() => {
    }).catch(() => {
      done();
    });
  });

  it('Change username: successful', (done) => {
    const token = authService.generateAuthToken({ username: 'admin' }).token;
    authService.changeUsername(token, 'newusername')
      .then((user) => {
        expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
        expect(user.username).to.equal('newusername');
        return authService.findUserByCredentials('newusername', 'newpassword');
      })
      .then((user) => {
        expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
        expect(user.username).to.equal('newusername');
        return statisticsService.getByUsername('newusername');
      }).then((stats) => {
        expect(stats).to.not.be.null; // eslint-disable-line no-unused-expressions
        expect(stats.username).to.equal('newusername');
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
