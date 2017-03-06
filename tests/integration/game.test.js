const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/game', () => {
  it('create game', (done) => {
    chai.request(app)
      .post('/api/game')
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line no-unused-expressions
        expect(res).to.have.status(200);
        expect(res).to.be.json; // eslint-disable-line no-unused-expressions
        expect(res.body).to.have.property('player');
        expect(res.body.player).to.have.property('id');
        expect(res.body.player).to.have.property('cards');
        expect(res.body.player.cards).to.be.an('array');
        expect(res.body.player.cards.length).to.equal(13);
        expect(res.body).to.have.property('game');
        expect(res.body.game).to.have.property('id');
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
});
