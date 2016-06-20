/*
** This file creates a stream of objects for each repository in a given organization.
** It creates the stream by first making a call to the Github API using the github npm
** module (which acts like a wrapper). It then iterates through the results returned
** by the API call, pushing each object into a stream. The stream is returned in the
** callback of the function exported by the module.
*/

var GitHubApi = require('github');
var stream = require('stream');
var es = require('event-stream');

var reposForOrg = function(options, done) {
  var github = new GitHubApi({
    debug: false,
    protocol: 'https',
    host: 'api.github.com',
    pathPrefix: null,
    timeout: 5000,
    followRedirects: false

  });

  github.authenticate({
    type: 'oauth',
    token: options.token
  }, function(error, response) {
    if (error) {
      return done(error);
    }
  });

  github.getAllPages(github.repos.getForOrg, {
    org: options.org
  }, function(error, response) {
    if (error) {
      return done(error);
    }
    done(null, response);
  });
};

module.exports = function(options) {
  return es.readable(function(count, callback) {
    reposForOrg(options, function(err, res) {
      if (err) {
        return this.emit('error', err);
      }
      res.forEach(function(data) {
        if (options.grep && !data.name.match(options.grep)) {
          return;
        }
        if (!options.forked && data.fork) {
          return;
        }
        if (options.keys) {
          var obj = {};
          for (var i = 0; i < options.keys.length; ++i) {
            obj[options.keys[i]] = data[options.keys[i]];
          }
          this.emit('data', obj);
        } else {
          this.emit('data', data);
        }
      }.bind(this));
      this.emit('end');
      callback();
    }.bind(this));
  });
};
