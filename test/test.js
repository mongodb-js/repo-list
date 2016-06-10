var stream = require('stream');
var chai = require('chai');
var assert = chai.assert;

var reposForOrg = require('../lib/index.js');

function isObject(obj) {
  return obj instanceof Object;
}

function hasProperties(obj) {
  return obj.hasOwnProperty('name')
    && obj.hasOwnProperty('url');
}

describe('RepoOrgs', function() {

  it('should return a stream', function (done) {
    reposForOrg({'org' : 'mongodb-js'}, function(err, res) {
      assert.isTrue(res instanceof stream.Readable);
      done();
    });
  });

  it('should return a stream of objects', function(done) {
    reposForOrg({'org' : 'mongodb-js'}, function(err, res) {
      var data = []
      res.on('data', function(chunk) {
        data.push(chunk);
      });

      res.on('end', function() {
        assert.isTrue(data.every(isObject));
        done();
      });
    });
  });

  it('objects have property name and url', function(done) {
    reposForOrg({'org' : 'mongodb-js'}, function(err, res) {
      var data = []
      res.on('data', function(chunk) {
        data.push(chunk);
      });

      res.on('end', function() {
        assert.isTrue(data.every(hasProperties));
        done();
      });
    });
  });

});