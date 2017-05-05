const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const gameService = require('../../services/gameService');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/game', () => {
  it('Invalid game creation', (done) => {
    chai.request(app)
      .post('/api/game')
      .send({ playerName: 'Human', playerCount: 4, cpuPlayerCount: 4, gameCount: 1 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful game creation', (done) => {
    chai.request(app)
      .post('/api/game')
      .send({ playerName: 'Human', playerCount: 4, cpuPlayerCount: 3, gameCount: 1 })
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('player');
        expect(res.body.player.name).to.equal('Human');
        expect(res.body.player).to.have.property('id');
        expect(res.body.player).to.have.property('cards');
        expect(res.body.player.cards).to.be.an('array');
        expect(res.body.player.cards.length).to.equal(13);
        expect(res.body).to.have.property('playerIndex');
        expect(res.body.playerIndex).to.equal(0);
        expect(res.body).to.have.property('game');
        expect(res.body.game).to.have.property('id');
        expect(res.body.game).to.have.property('playerCount');
        expect(res.body.game).to.have.property('state');
        expect(res.body.game).to.have.property('isFirstTurn');
        expect(res.body.game).to.have.property('isRevolution');
        expect(res.body.game).to.have.property('previousHit');
        expect(res.body.game.previousHit).to.be.an('array');
        expect(res.body.game).to.have.property('players');
        expect(res.body.game.players).to.be.an('array');
        expect(res.body.game.players.length).to.equal(4);
        expect(res.body.game.players[0]).to.have.property('name');
        expect(res.body.game.players[0]).to.have.property('isCpu');
        expect(res.body.game.players[0]).to.have.property('cardCount');
        expect(res.body.game.players[0]).to.have.property('turn');
        expect(res.body.game.players[0]).to.have.property('status');
        done();
      });
  });

  it('Invalid game join (game already full)', (done) => {
    let game = gameService.createGame('Human', 4, 3, 1).game;

    chai.request(app)
      .post('/api/game/' + game.id + '/join')
      .send({ playerName: 'Human 2' })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Invalid game join (invalid player name)', (done) => {
    let game = gameService.createGame('Human', 4, 2, 1).game;

    chai.request(app)
      .post('/api/game/' + game.id + '/join')
      .send({ playerName: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('Successful game join', (done) => {
    let game = gameService.createGame('Human', 4, 2, 1).game;

    chai.request(app)
      .post('/api/game/' + game.id + '/join')
      .send({ playerName: 'Human 2' })
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('player');
        expect(res.body).to.have.property('playerIndex');
        expect(res.body.playerIndex).to.equal(3);
        expect(res.body).to.have.property('game');
        expect(res.body.game.players.length).to.equal(4);
        done();
      });
  });

  it('Successful game quit', (done) => {
    let game = gameService.createGame('Human', 4, 3, 1).game;

    chai.request(app)
      .post('/api/game/' + game.id + '/quit')
      .send({ clientId: game.players[0].id })
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        done();
      });
  });
});
