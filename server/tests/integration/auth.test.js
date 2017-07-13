const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../../app');
const dbService = require('../../services/databaseService');
const authService = require('../../services/authService');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/auth', () => {
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

  it('Unsuccessful login', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'invalid_password' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful login', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('expires');
        done();
      });
  });

  it('Unsuccessful register: invalid username', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: '', password: 'password', email: 'email@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessful register: invalid password', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'username', password: '', email: 'email@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessful register: invalid email', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'username', password: 'password', email: 'email' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessful register: username reserved', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'admin', password: 'admin', email: 'admin@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful register', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'username', password: 'password', email: 'email@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Unsuccessful activation: invalid token', (done) => {
    chai.request(app)
      .post('/api/auth/activate')
      .send({ access_token: 'invalid' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessful activation: already active', (done) => {
    const token = authService.generateAccountActivationToken('admin').token;
    chai.request(app)
      .post('/api/auth/activate')
      .send({ access_token: token })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful activation', (done) => {
    authService.register('user', 'password', 'user@slavegame.net').then(() => {
      const token = authService.generateAccountActivationToken('user').token;
      chai.request(app)
        .post('/api/auth/activate')
        .send({ access_token: token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  it('Unsuccessful remove: invalid token', (done) => {
    chai.request(app)
      .post('/api/auth/remove')
      .send({ access_token: 'invalid' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful remove', (done) => {
    authService.register('user2', 'password', 'user2@slavegame.net').then(() => {
      const token = authService.generateAuthToken({ username: 'user2' }).token;
      authService.activate(token).then(() => {
        chai.request(app)
          .post('/api/auth/remove')
          .send({ access_token: token })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

  it('Unsuccessful forgot: invalid email', (done) => {
    chai.request(app)
      .post('/api/auth/forgot')
      .send({ email: 'not_found' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful forgot', (done) => {
    chai.request(app)
      .post('/api/auth/forgot')
      .send({ email: 'admin@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Unsuccessful password renew: invalid password', (done) => {
    const token = authService.generateForgotPasswordToken('admin').token;
    chai.request(app)
      .post('/api/auth/renew')
      .send({ access_token: token, password: 'pwd' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessful password renew: invalid token', (done) => {
    chai.request(app)
      .post('/api/auth/renew')
      .send({ access_token: 'invalid_token', password: 'pwd' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful password renew', (done) => {
    const token = authService.generateForgotPasswordToken('admin').token;
    chai.request(app)
      .post('/api/auth/renew')
      .send({ access_token: token, password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Unsuccessful username change: invalid username', (done) => {
    const token = authService.generateAuthToken({ username: 'admin' }).token;
    chai.request(app)
      .post('/api/auth/username')
      .send({ access_token: token, username: 'this_is_too_long' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessful username change: invalid token', (done) => {
    chai.request(app)
      .post('/api/auth/username')
      .send({ access_token: 'invalid_token', username: 'newusername' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessful username change: username reserved', (done) => {
    const token = authService.generateAuthToken({ username: 'admin' }).token;
    chai.request(app)
      .post('/api/auth/username')
      .send({ access_token: token, username: 'admin' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful username change', (done) => {
    const token = authService.generateAuthToken({ username: 'user' }).token;
    chai.request(app)
      .post('/api/auth/username')
      .send({ access_token: token, username: 'user2' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('expires');
        // Ensure that the returned token is valid
        authService.findUserByToken(res.body.token).then((user) => {
          expect(user).to.not.be.null; // eslint-disable-line no-unused-expressions
          expect(user.username).to.equal('user2');
          done();
        });
      });
  });

  it('Username not available', (done) => {
    chai.request(app)
      .get('/api/auth/usernameAvailable?username=admin')
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('available');
        expect(res.body.available).to.equal(false);
        done();
      });
  });

  it('Username available', (done) => {
    chai.request(app)
      .get('/api/auth/usernameAvailable?username=nonexisting')
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('available');
        expect(res.body.available).to.equal(true);
        done();
      });
  });
});
