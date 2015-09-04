var request = require('request'),
    expect = require('chai').expect,
    path = require('path');

var host = 'http://localhost:3000/',
    user = 'Jon Snow',
    details = {
        lat: 12.927564,
        lng: 77.680545,
        ts: 1436176807107
    };

describe('UserDetails', function () {
    it("should return error while reading the user who doesn't exist", function (done) {
        request.get(host + 'user/5/1', function (err, res, body) {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.equal('User not found');
            done();
        });
    });

    it("should return user data with requested route details while reading route details", function (done) {
        request.get(host + 'user/1/2', function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            var data = JSON.parse(res.body);
            expect(data.name).to.equal(user);
            expect(data.route).to.equal(details);
            expect(data.route.lat).to.equal(details.lat);
            expect(data.route.lng).to.equal(details.lng);
            expect(data.route.ts).to.equal(details.ts);
            done();
        });
    });


    it("should return user data with requested route details while reading route details", function (done) {
        request.get(host + 'user/1/200', function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            var data = JSON.parse(res.body);
            expect(data.name).to.equal(user);
            expect(data.route).to.equal(undefined);
            done();
        });
    });

});