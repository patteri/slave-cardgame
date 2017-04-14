const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const gameService = require('../../services/gameService');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/game/:id/cardExchange', () => {
  it('unknown game id', (done) => {
    chai.request(app)
      .get('/api/game/unknown/cardExchange')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('unknown user id', (done) => {
    const game = gameService.createGame('Human', 4, 3);

    chai.request(app)
      .get('/api/game/' + game.game.id + '/cardExchange?clientId=unknown')
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('successfull query', (done) => {
    const game = gameService.createGame('Human', 4, 3, false).game;
    game._players[0].position = 1;
    game._players[1].position = 2;
    game._players[2].position = 3;
    game._players[3].position = 4;
    game.gameEnded();

    chai.request(app)
      .get('/api/game/' + game.id + '/cardExchange?clientId=' + game._players[0].id)
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('cards');
        expect(res.body.cards).to.be.an('array');
        expect(res.body).to.have.property('exchangeRule');
        expect(res.body.exchangeRule).to.have.property('exchangeCount');
        expect(res.body.exchangeRule).to.have.property('exchangeType');
        expect(res.body.exchangeRule).to.have.property('toPlayer');
        expect(res.body.exchangeRule.toPlayer).to.be.an('object');
        expect(res.body).to.have.property('game');
        expect(res.body.game).to.be.an('object');
        done();
      });
  });

  it('illegal game state', (done) => {
    const game = gameService.createGame('Human', 4, 3, false).game;

    chai.request(app)
      .get('/api/game/' + game.id + '/cardExchange?clientId=' + game._players[0].id)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });
});
