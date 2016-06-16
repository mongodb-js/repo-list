#!/usr/bin/env node

var reposForOrg = require('./lib/index.js');
var yargs = require('yargs');
var fs = require('fs');
var yaml = require('js-yaml');
var EJSON = require('mongodb-extended-json');
var Table = require('cli-table')

var options = yargs.usage("Usage: $0 <organization> -t <oauth token> [options]")
  .required( 1, "*Organization is required*")
  .option('token', {
    alias: 't',
    describe: 'github oauth access token'
  })
  .require('token')
  .option('forked', {
    describe: 'include forked directories'
  })
  .option('out', {
    alias: 'o',
    describe: 'write to file instead of stdout',
    default: null
  })
  .option('keys', {
    alias: 'k',
    describe: 'keys to include in output',
    default: ['name', 'html_url']
  })
  .array('keys')
  .option('format', {
    describe: 'choose format',
    default: 'json'
  })
  .option('grep', {
    alias: 'g',
    describe: 'find repos of a certain pattern'
  })
  .choices('format', ['json', 'yaml', 'table'])
  .choices('keys', ['name', 'html_url'])
  .default('forked', false)
  .help('help')
  .alias('help', 'h')
  .argv

var argv = yargs.argv;
var data = [];

reposForOrg({'org' : options._[0],
             'forked' : argv.forked,
             'token' : argv.token,
             'keys' : argv.keys,
             'grep' : argv.grep
           }, function(err, res) {
  if (err) {
    console.error(err);
  }
  else{
    res.on('data', function(chunk) {
      data.push(chunk);
    });
    res.on('end', function() {
      writeData();
    })
  }
});

function makeTable(arr, keys) {
  let cols = []
  for(var i = 0; i < keys.length; ++i){
    cols.push(50)
  }
  var table = new Table({
    head: keys,
    colWidths: cols
  });
  for(var i = 0; i < arr.length; ++i) {
    let new_row = []
    for(var j = 0; j < keys.length; ++j) {
      new_row.push(arr[i][keys[j]]);
    }
    table.push(new_row);
  }
  return table;
}

function writeData() {
  var output = ''
  if (argv.format === 'yaml') {
    output = yaml.dump(data);
  }
  else if (argv.format === 'table') {
    output = makeTable(data, argv.keys).toString();
  }
  else {
    output = EJSON.stringify(data, null, 2);
  }

  if (argv.out) {
    var stream = fs.createWriteStream(argv.out);
    stream.write(output);
    stream.end();
  }
  else {
    console.log(output);
  }
}