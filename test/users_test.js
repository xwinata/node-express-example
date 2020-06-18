var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
const { expect } = require('chai');

chai.use(chaiHttp);
let token = ""
let testcreateid = 0

describe('Users', function () {
    describe('login', function () {
      it("should get token", (done) => {
            chai.request(app)
                .post('/auth')
                .send({email: 'abai@email.com', password:'abai123'})
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    token = response.body.token
                    done();
                });
        });
    });

    describe('profile', function () {
        it("should get current profile", (done) => {
            chai.request(app)
                .get('/users/profile')
                .set('Authorization', 'Bearer '+token)
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    done();
                });
        });
    });

    describe('user list', function () {
        it("should get user list", (done) => {
            chai.request(app)
                .get('/users')
                .set('Authorization', 'Bearer '+token)
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    done();
                });
        });
    });

    describe('user by mail or name', function () {
        it("should get user list", (done) => {
            chai.request(app)
                .get('/users/abai@email.com')
                .set('Authorization', 'Bearer '+token)
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    done();
                });
        });
    });

    describe('create user', function () {
        it("should create a user", (done) => {
            chai.request(app)
                .post('/users')
                .set('Authorization', 'Bearer '+token)
                .send({
                    "name": "testing123",
                    "email": "mail@mail.com",
                    "address": "jl. baru",
                    "phonenumber": "089876541230",
                    "ktp": "2123456789109999",
                    "npwp": "11.000.000.0-000.000",
                    "passport": "Z0000000"
                })
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    testcreateid = response.body.id
                    done();
                });
        });
    });

    describe('patch user', function () {
        it("should update user by id", (done) => {
            chai.request(app)
                .patch(`/users/${testcreateid}`)
                .set('Authorization', 'Bearer '+token)
                .send({"name": "testing124"})
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    done();
                });
        });
    });

    describe('delete user', function () {
        it("should delete user by id", (done) => {
            chai.request(app)
                .delete(`/users/${testcreateid}`)
                .set('Authorization', 'Bearer '+token)
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    done();
                });
        });
    });
  });