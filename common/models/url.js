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

  Url.remoteMethod(
    'redirectToOriginalURL',
    {
      description: 'API to redirect to original url',
      accepts: [
        {
          arg: 'id',
          type: 'string',
          required: true,
        },
      ],
      http: {path: '/:id', verb: 'get'},
      returns: {
        arg: 'url', type: 'string', root: true,
      },
    }
);

  /**
   * Generate url if not exists.
   *
   * @param {String} urlStr input URL string
   */
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

    Url.findOrCreate(
      {where: {url: urlStr}},
      {id: randomstring.generate(10), url: urlStr},
      function(err, url, created) {
        if (err) return next(err);

        return next(null, `${common.genrateURL(url.id)}`);
      }
    );

    return next.promise;
  };

  /**
   * Find & Redirect to original url.
   *
   * @param {String} id URL id.
   */
  Url.redirectToOriginalURL = function(id, next) {
    try {
      assert(typeof id === 'string', 'invalid url type');
    } catch (e) {
      let err = new Error(g.f(e.message));
      err.statusCode = 422;
      err.code = 'UNPROCESSABLE_ENTITY';
      return next(err);
    }

    Url.findById(id,
      function(err, url) {
        if (err) return next(err);
        if (!url) {
          let err = new Error(g.f('url not found with id ' + id));
          err.statusCode = 404;
          err.code = 'NOT_FOUND';
          return next(err);
        }
        return next(null, url);
      }
    );
  };

  Url.afterRemote('redirectToOriginalURL',
    function(ctx, remoteMethodOutput, next) {
      if (remoteMethodOutput.url) {
        ctx.res.status(302);
        ctx.res.location(remoteMethodOutput.url);
      }
      next();
    });
};
