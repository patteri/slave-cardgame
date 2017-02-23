const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('routes', () => {
  it('POST /api/game', (done) => {
    chai.request(app)
      .post('/api/game')
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('player');
        expect(res.body.player).to.have.property('id');
        expect(res.body.player).to.have.property('cards');
        expect(res.body.player.cards.length).to.equal(13);
        expect(res.body).to.have.property('game');
        expect(res.body.game).to.have.property('id');
        expect(res.body.game).to.have.property('players');
        expect(res.body.game.players.length).to.equal(4);
        done();
      });
  });

  it('GET undefined URL', (done) => {
    chai.request(app)
      .get('/api/url-does-not-exist')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
