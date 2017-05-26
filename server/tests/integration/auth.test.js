const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../../app');
const dbService = require('../../services/databaseService');

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

  it('Unsuccessfull login', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'invalid_password' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successfull login', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Unsuccessfull register: invalid username', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: '', password: 'password', email: 'email@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessfull register: invalid password', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'username', password: '', email: 'email@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessfull register: invalid email', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'username', password: 'password', email: 'email' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Unsuccessfull register: username reserved', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'admin', password: 'admin', email: 'admin@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successfull register', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ username: 'username', password: 'password', email: 'email@slavegame.net' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
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
