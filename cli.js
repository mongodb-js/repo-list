#!/usr/bin/env node

var reposForOrg = require('./lib/index.js');
var yargs = require('yargs');

var options = yargs.usage("Usage: $0 <organization> [options]")
  .required( 1, "*Organization is required*")
  .option('forked', {
    alias: 'f',
    describe: 'include forked directories'
  })
  .default('forked', false)
  .help('help')
  .alias('help', 'h')
  .argv

var argv = yargs.argv

reposForOrg({'org' : options._[0] , 'forked' : argv.forked}, function(err, res) {
  if (err) {
    console.error(err);
  }
  else{
    res.on('data', function(chunk) {
      console.log(chunk.name);
    });
  }
});