var chai = require('chai');
var sinon = require('sinon');
var GitHubApi = require("github");
var assert = chai.assert;


var reposForOrg = require('../lib/index.js');

function isObject(obj) {
  return obj instanceof Object;
}

function hasProperties(obj) {
  return obj.hasOwnProperty('name')
    && obj.hasOwnProperty('html_url');
}

describe('RepoOrgs', function() {

  before(function(done) {
    sinon.stub(GitHubApi.prototype, 'authenticate')
    // sinon.stub(GitHubApi.prototype, 'getAllPages')
    //       .yields(null, 'hello');
    // sinon.stub(GitHubApi.prototype.repos, 'getForOrg');
    done();
  });

  // after(function(done){
  //   GitHubApi.prototype.authenticate.restore();
  //   // GitHubApi.prototype.getAllPages.restore();
  //   done();
  // });

  keys = ['name', 'html_url']

  it('should return a stream', function () {
    var str = reposForOrg({'org' : 'mongodb-js', 'keys' : keys});
    assert.isTrue(str instanceof es.Readable);
  });

  it('should return a stream of objects', function() {
    var str = reposForOrg({'org' : 'mongodb-js', 'keys' : keys});
    var data = []
    str.on('data', function(chunk) {
      data.push(chunk);
    });

    str.on('end', function() {
      assert.isTrue(data.every(isObject));
    });
  });

  it('objects have property name and url', function() {
    var str = reposForOrg({'org' : 'mongodb-js', 'keys' : keys});
    var data = []
    str.on('data', function(chunk) {
      data.push(chunk);
    });

    str.on('end', function() {
      assert.isTrue(data.every(hasProperties));
    });
  });
});