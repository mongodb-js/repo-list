var mongodbJsRepoList = require('../');
var assert = require('assert');
var sinon = require('sinon');
var GitHubApi = require('github');

var reposForOrg = require('../lib/index.js');

function isObject(obj) {
  return obj instanceof Object;
}

function hasProperties(obj) {
  return obj.hasOwnProperty('name')
    && obj.hasOwnProperty('html_url');
}

describe('mongodb-js-repo-list', function() {

  before(function(done) {
    sinon.stub(GitHubApi.prototype, 'authenticate');
    done();
  });

  after(function(done) {
    GitHubApi.prototype.authenticate.restore();
    done();
  });

  keys = ['name', 'html_url'];

  it('should work', function() {
    assert(mongodbJsRepoList);
  });
  it('should return a stream of objects', function() {
    var str = reposForOrg({
      org: 'mongodb-js',
      keys: keys
    });
    var data = [];
    str.on('data', function(chunk) {
      data.push(chunk);
    });

    str.on('end', function() {
      assert.isTrue(data.every(isObject));
    });
  });

  it('objects have property name and url', function() {
    var str = reposForOrg({
      org: 'mongodb-js',
      keys: keys
    });
    var data = [];
    str.on('data', function(chunk) {
      data.push(chunk);
    });

    str.on('end', function() {
      assert.isTrue(data.every(hasProperties));
    });
  });
});
