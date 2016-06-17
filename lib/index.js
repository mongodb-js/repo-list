var GitHubApi = require("github");
var stream = require('stream');
var es = require('event-stream')

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
    done(null, response);
  });
}

module.exports = function(options) {
  return es.readable(function(count, callback) {
    var lst = reposForOrg(options, function(err, res) {
      if (err) {
        return this.emit('error', err);
      }
      res.forEach(function(data){
        if (options.grep && !data.name.match(options.grep)) {
          return;
        }
        if (!options.forked && data.fork){
          return;
        }
        if(options.keys){
          var obj = {}
          for(var i = 0; i < options.keys.length; ++i){
            obj[options.keys[i]] = data[options.keys[i]]
          }
          this.emit('data', obj);
        }
        else{
          this.emit('data', data);
        }
      }.bind(this))
      this.emit('end');
      callback();
    }.bind(this));
  });
};
