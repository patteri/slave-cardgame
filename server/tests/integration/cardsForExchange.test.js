const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const gameService = require('../../services/gameService');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/game/:id/cardsForExchange', () => {
  it('unknown game id', (done) => {
    chai.request(app)
      .post('/api/game/unknown/cardsForExchange')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('unknown user id', (done) => {
    const game = gameService.createGame('Human', 4, 3, 1, false, false);

    chai.request(app)
      .post(`/api/game/${game.game.id}/cardsForExchange`)
      .send({ clientId: 'unknown', cards: [ game.player.hand[0] ] })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });

  it('successful exchange', (done) => {
    const game = gameService.createGame('Human', 4, 3, 2, false, false, false).game;
    game._players[0].position = 1;
    game._players[1].position = 2;
    game._players[2].position = 3;
    game._players[3].position = 4;
    game.gameEnded();

    chai.request(app)
      .post(`/api/game/${game.id}/cardsForExchange`)
      .send({ clientId: game._players[0].id, cards: [ game._players[0].hand[0], game._players[0].hand[1] ] })
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        done();
      });
  });

  it('illegal game state', (done) => {
    const game = gameService.createGame('Human', 4, 3, 1, false, false, false).game;

    chai.request(app)
      .post(`/api/game/${game.id}/cardsForExchange`)
      .send({ clientId: game._players[0].id, cards: [ game._players[0].hand[0], game._players[0].hand[1] ] })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        done();
      });
  });
});
