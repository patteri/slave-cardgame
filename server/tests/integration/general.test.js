const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('general API tests', () => {
  it('undefined URL', (done) => {
    chai.request(app)
      .get('/api/url-does-not-exist')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
