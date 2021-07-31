'use strict';

var app = require('../server/server');
var request = require('supertest');
var assert = require('assert');
var loopback = require('loopback');

function httpRequest(verb, url) {
  return request(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
}

describe('REST API request', function() {
  before(function(done) {
    require('./start-server');
    done();
  });

  after(function(done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });
  ['https://google.com', '127.0.0.1', 'http://local-url-shortener.com:3000', 'http://127.0.0.1:3013'].forEach(function(url) {
    it('should generate a new url for ' + url, function(done) {
      httpRequest('post', '/generate-url')
        .type('form')
        .send({url})
        .expect(function(res) {
          console.log('POST response body:' + JSON.stringify(res.body));
        })
        .expect(200, done);
    });
  });

  [1, 'abcd', 'localhost'].forEach(function(url) {
    it('should throw error with unprocessable entity with input url as ' + url,
    function(done) {
      console.log(url);
      httpRequest('post', '/generate-url')
      .type('form')
      .send({url})
      .expect(422)
      .end(function(err, res) {
        if (err) return done(err);
        const body = res.body;
        assert.equal(body.error.code, 'UNPROCESSABLE_ENTITY');
        done();
      });
    });
  });
});

