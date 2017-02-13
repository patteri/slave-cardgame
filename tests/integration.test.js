const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('routes', () => {
  it('GET /api/test', (done) => {
    chai.request(app)
      .get('/api/test')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.an('object');
        res.body.should.have.property('content');
        done();
      });
  });

  it('GET undefined URL', (done) => {
    chai.request(app)
      .get('/api/url-does-not-exist')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});