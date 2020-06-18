var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
const { expect } = require('chai');

chai.use(chaiHttp);

describe('Auth', function () {
    describe('login', function () {
        it("should not found", (done) => {
            chai.request(app)
                .post('/auth')
                .send({email: 'no@email.com', password:'abai123'})
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(404)
                    done();
                });
        });
        it("should get wrong password error", (done) => {
            chai.request(app)
                .post('/auth')
                .send({email: 'abai@email.com', password:'wrong pass'})
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(401)
                    done();
                });
        });
        it("should get token", (done) => {
            chai.request(app)
                .post('/auth')
                .send({email: 'abai@email.com', password:'abai123'})
                .end(function(error, response) {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200)
                    done();
                });
        });
    });
});