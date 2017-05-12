const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const gameService = require('../../services/gameService');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/game/:id/hit', () => {
  it('unknown game id', (done) => {
    chai.request(app)
      .post('/api/game/uknown/hit')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('unknown user id', (done) => {
    const game = gameService.createGame('Human', 4, 3, 1);

    chai.request(app)
      .post(`/api/game/${game.game.id}/hit`)
      .send({ clientId: 'unknown', cards: [ game.player.hand[0] ] })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('successfull hit', (done) => {
    const game = gameService.createGame('Human', 4, 3, 1, false).game;

    chai.request(app)
      .post(`/api/game/${game.id}/hit`)
      .send({ clientId: game._players[1].id, cards: [ game._players[1].hand[0] ] })
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('cards');
        expect(res.body.cards).to.be.an('array');
        expect(res.body.cards.length).to.equal(12);
        done();
      });
  });

  it('illegal game state', (done) => {
    const game = gameService.createGame('Human', 4, 3, 1, false).game;
    game._players[0].position = 1;
    game._players[1].position = 2;
    game._players[2].position = 3;
    game._players[3].position = 4;
    game.gameEnded();

    chai.request(app)
      .post(`/api/game/${game.id}/hit`)
      .send({ clientId: game._players[1].id, cards: [ game._players[1].hand[0] ] })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });
});
