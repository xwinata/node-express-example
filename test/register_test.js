var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
const { expect } = require('chai');

chai.use(chaiHttp);

describe('Register', function () {
    describe('register', function () {
        it("should get validation error", (done) => {
            chai.request(app)
                .post('/register')
                .send({novar:"atall"})
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(422)
                    done();
                });
        });
        it("should get success registration", (done) => {
            chai.request(app)
                .post('/register')
                .send({
                    name: "Test User Regis",
                    email: "register@email.com",
                    phonenumber: "0811111111111",
                    address: "st. testing",
                    ktp: "1234123412341234",
                    npwp: "00.333.000.0-000.000",
                    passport: "G1212121",
                    password: "thepass"

                })
                .end(function(error, response, body) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    done();
                });
        });
    });
});