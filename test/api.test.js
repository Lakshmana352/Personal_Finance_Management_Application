const request = require('supertest');
const app = require('../server');


let token = "";
let transactionId = "";


describe('Unit testing auth routes', function(){
  describe('POST /api/signup', function() {
    it('Create account', function(done) {
      request(app)
      .post('/api/signup')
      .send({name: "Lakshmana",email: "lakshmana@gmail.com",password: "Strong@12"})
      .expect(400, done);
    });
  });
  describe('POST /api/signin', function() {
    it('Signin into account', function(done) {
      request(app)
      .post('/api/signin')
      .send({ email: "lakshmana@gmail.com", password: "Strong@12" })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        const jsonres = JSON.parse(res.text)
        token = jsonres.content.accesstoken;
        done();
      });
    });
  });
});

describe('Unit testing type routes',function(){
  describe('POST /api/type',function(){
    it('Create type',function(done){
      request(app)
      .post('/api/type')
      .send({name: "Income"})
      .expect(400,done);
    })
  })
  describe('GET /api/type',function(){
    it('Get all types',function(done){
      request(app)
      .get('/api/type')
      .expect(200,done);
    })
  })
})

describe('Unit testing transaction routes',function(){
  describe('POST /api/transactions',function(){
    it('Create Transaction',function(done){
      request(app)
      .post('/api/transactions/')
      .set('authorization',`Bearer ${token}`)
      .send({ type: "7172328198294887489", amount: 2000})
      .expect(200)
      .end(function(err,res){
        if (err) return done(err);
        const jsonres = JSON.parse(res.text)
        transactionId = jsonres.content.data.id;
        done();
      })
    })
  })
  describe('GET /api/transactions',function(){
    it('get all transactions',function(done){
      request(app)
      .get('/api/transactions')
      .set('authorization',`Bearer ${token}`)
      .expect(200,done)
    })
  })
  describe('GET /api/transactions/summary',function(){
    it('get trasaction summary',function(done){
      request(app)
      .get('/api/transactions/summary')
      .set('authorization',`Bearer ${token}`)
      .expect(200,done)
    })
  })
  describe('DELETE /api/transactions/:id',function(){
    it('Delete trasaction with ID - id',function(done){
      request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set('authorization',`Bearer ${token}`)
      .expect(200,done)
    })
  })
});