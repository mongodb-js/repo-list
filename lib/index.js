var GitHubApi = require("github");
var stream = require('stream');

var reposForOrg = function(options, done) {
  var github = new GitHubApi({
    debug: false,
    protocol: "https",
    host: "api.github.com", 
    pathPrefix: null,
    timeout: 5000,
    followRedirects: false
        
  });

  github.authenticate({
    type: "oauth",
    token: options.token
  })

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
        if (options.grep && !response[i].name.match(options.grep)) {
          continue;
        }
        if (!forked && response[i].fork){
          continue;
        }
        var obj = {};
        for(var j = 0; j < options.keys.length; ++j) {
          obj[options.keys[j]] = response[i][options.keys[j]];
        }
        readStr.push(obj);
      }
      readStr.push(null);
    }
    done(null, readStr);
  });
}

module.exports = reposForOrg;
