const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../../app');
const dbService = require('../../services/databaseService');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/stats', () => {
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

  it('No properties', (done) => {
    chai.request(app)
      .get('/api/stats')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(Object.getOwnPropertyNames(res.body).length).to.equal(0);
        done();
      });
  });

  it('Has properties', (done) => {
    chai.request(app)
      .get('/api/stats?properties=totalGames,averageGamePoints')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('totalGames');
        expect(res.body).to.have.property('averageGamePoints');
        expect(res.body.totalGames).to.be.an('array');
        expect(res.body.totalGames.length).to.equal(4);
        expect(res.body.totalGames[0]).to.have.property('name');
        expect(res.body.totalGames[0]).to.have.property('value');
        done();
      });
  });

  it('Extra properties', (done) => {
    chai.request(app)
      .get('/api/stats?properties=totalGames,averageGamePoints,notExists')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.getOwnPropertyNames(res.body).length).to.equal(2);
        expect(res.body).to.have.property('totalGames');
        expect(res.body).to.have.property('averageGamePoints');
        done();
      });
  });

  it('Get by non-existing username', (done) => {
    chai.request(app)
      .get('/api/stats/non-existing')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Get by username', (done) => {
    chai.request(app)
      .get('/api/stats/player%201')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('username');
        expect(res.body).to.have.property('totalGames');
        expect(res.body).to.have.property('averageGamePoints');
        expect(res.body).to.have.property('totalGameWins');
        expect(res.body).to.have.property('totalGameLooses');
        expect(res.body).to.have.property('totalTournaments');
        expect(res.body).to.have.property('averageTournamentPoints');
        expect(res.body).to.have.property('totalInterrupts');
        expect(res.body).to.have.property('currentWinningStreak');
        expect(res.body).to.have.property('longestWinningStreak');
        expect(res.body).to.have.property('currentLooseStreak');
        expect(res.body).to.have.property('longestLooseStreak');
        done();
      });
  });
});
