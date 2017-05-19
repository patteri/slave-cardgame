const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/auth', () => {
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
