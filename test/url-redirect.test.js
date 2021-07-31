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
    it('should redirect to  url ' + url, function(done) {
      httpRequest('post', '/generate-url')
        .type('form')
        .send({url})
        .expect(200)
        .end(function(err, res) {
          httpRequest('get', res.body.substring(res.body.lastIndexOf('/') + 1))
          .redirects(1)
          .end(function() {
            done();
          });
        });
    });
  });

  ['testing-fake-id', 'abcedefgh', 'dsfnlkdsfk@nfkdsfk', '&!']
  .forEach(function(id) {
    it('should throw error not found for id ' + id, function(done) {
      httpRequest('get', id)
          .redirects(0)
          .expect(404)
          .end(function() {
            done();
          });
    });
  });
});

