'use strict';

const assert = require('assert');
const g = require('loopback/lib/globalize');
const randomstring = require('randomstring');
const validators = require('../utilities/validators');
const common = require('../utilities/common');

module.exports = function(Url) {
  Url.remoteMethod(
      'generateUrl',
    {
      description: 'API to generate url',
      accepts: [
        {
          arg: 'url',
          type: 'string',
          required: true,
        },
      ],
      http: {
        verb: 'post', path: '/generate-url',
      },
      returns: {
        arg: 'url', type: 'string', root: true,
      },
    }
  );

  Url.generateUrl = function(urlStr, next) {
    try {
      assert(validators.validURL(urlStr), 'invalid url');
      assert(typeof urlStr === 'string', 'invalid url type');
    } catch (e) {
      let err = new Error(g.f(e.message));
      err.statusCode = 422;
      err.code = 'UNPROCESSABLE_ENTITY';
      return next(err);
    }

    Url.create({id: randomstring.generate(10), url: urlStr},
      function(err, url) {
        if (err) return next(err);
        console.log(url);
        return next(null, `${common.genrateURL(url.id)}`);
      }
    );
    return next.promise;
  };
};
