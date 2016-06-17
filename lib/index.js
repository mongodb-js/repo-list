/* 
** This file creates a stream of objects for each repository in a given organization. 
** It creates the stream by first making a call to the Github API using the github npm 
** module (which acts like a wrapper). It then iterates through the results returned 
** by the API call, pushing each object into a stream. The stream is returned in the 
** callback of the function exported by the module.
*/
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
        readStr.push({
          name : response[i].name,
          url : response[i].html_url
        });
      }
      readStr.push(null);
    }
    done(null, readStr);
  });
}

module.exports = reposForOrg;
