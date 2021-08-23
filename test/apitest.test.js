const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
const server = require('../app');

describe('Test account transaction', () => {
  it('it should GET account transaction receipt', (done) => {
  chai.request(server)
    .get('/eth/api/v1/transaction/0xeb17cf9f4eab5cb4f17f03a746c210d27c20030b3d07cd496804ee81b3267139')
    .end((err, res) => {
      (res.body).should.be.a('object');
      done();
      });
    });
  });

describe('Test ERC20 transaction', () => {
  it('it should GET ERC20 transaction receipt', (done) => {
  chai.request(server)
    .get('/eth/api/v1/transaction/0xba2a848412497665b35ed61d77cd89d632ad16fadcf0a25b60f1984d0d1ea54b')
    .end((err, res) => {
      (res.body.outs[0].type).should.be.eql("token");
      (res.body).should.be.a('object');

      done();
      });
    });
  });

describe('Test contract transaction', () => {
  it('it should GET deployed contract transaction receipt', (done) => {
  chai.request(server)
    .get('/eth/api/v1/transaction/0x7d34e0d7afdef9348fb2d25152351e335473f4f529342b8c15b4d73a8c3d7be1')
    .end((err, res) => {
      (res.body.outs[0].type).should.be.eql("transfer");
      (res.body).should.be.a('object');
      done();
      });
    });
  });