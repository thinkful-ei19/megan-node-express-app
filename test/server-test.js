'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});
  
describe('404 handler', function () {
  
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/bad/path')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
  
});

describe('post request test', function(){

  const newNote = {'title': 'Hello', 'content':'Oh Hi!'};
  
  it('should create a new note', function(){
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res).to.be.a('object');
        expect(res.body).to.include.keys('id','title', 'content');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newNote, {id: res.body.id}));
      });
  });
});

describe('404 handler for post', function () {
  
  const newNote = {'margs': '', 'content':'Oh Hi!'};

  it('should respond with 404 when given incorrect inputs', function () {
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
      });
  });
    
});
