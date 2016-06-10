var GitHubApi = require("github");
var util = require('util');
var stream = require('stream');

var reposForOrg = function(options, done) {
  var github = new GitHubApi({
    debug: false,
    protocol: "https",
    host: "api.github.com", 
    pathPrefix: null,
    timeout: 5000,
    headers: {
      "user-agent": "Brahm Gardner"
    },
    followRedirects: false
        
  });

  var readStr = stream.Readable({ objectMode: true });
    
  github.getAllPages(github.repos.getForOrg, {
    org: options.org
  }, function(error, response) {
    if (error) {
      return done(error)
    }
    var forked = false;
    if (options.forked) {
      forked = true;
    }
    readStr._read = function (){
      for (var i = 0; i < response.length; ++i) {
        if (!forked && response[i].fork){
          continue;
        }
        var obj = {};
        obj['name'] = response[i].name;
        obj['url'] = response[i].html_url;
        readStr.push(obj);
      }
      readStr.push(null);
    }
    done(null, readStr);
  });
}

module.exports = reposForOrg;