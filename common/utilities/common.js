'use strict';
const loopback = require('loopback');
const app = require('../../server/server');

module.exports = {
  genrateURL: function(suffix) {
    const protocol = 'http';
    const host = (app && app.get('host'));
    const port = (app && app.get('port'));
    const restApiRoot = (app && app.get('restApiRoot'));
    const baseRoot =
      protocol +
      '://' +
      host +
      ':' +
      port +
      restApiRoot +
      suffix;

    return baseRoot;
  },
};
