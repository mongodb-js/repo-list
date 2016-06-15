#!/usr/bin/env node

var reposForOrg = require('./lib/index.js');
var yargs = require('yargs');
var fs = require('fs');

var options = yargs.usage("Usage: $0 <organization> -t <oauth token> [options]")
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
var data = []

reposForOrg({'org' : options._[0],
             'forked' : argv.forked
           }, function(err, res) {
  if (err) {
    console.error(err);
  }
  else{
    res.on('data', function(chunk) {
      data.push(chunk.name);
    });
    res.on('end', function() {
      writeData();
    })
  }
});

function writeData() {
  if (argv.out) {
    var stream = fs.createWriteStream(argv.out);
    for (var i = 0; i < data.length; ++i) {
      stream.write(data[i] + '\n');
    }
    stream.end('all data written');
  }
  else {
    for (var i = 0; i < data.length; ++i) {
      console.log(data[i]);
    }
  }
}