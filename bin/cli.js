#!/usr/bin/env node

/*
** This file creates command-line functionality for the module. It uses
** yargs to create an interface for typing on the command line, and then it retrieves
** the stream of objects from index.js. It then iterates through the stream, printing
** out each repository on a new line.
*/

/* eslint no-console:0 */

var reposForOrg = require('../lib/index.js');
var yargs = require('yargs');
var fs = require('fs');
var yaml = require('js-yaml');
var EJSON = require('mongodb-extended-json');
var Table = require('cli-table');

var options = yargs.usage('Usage: $0 <organization> -t <token> [options]')
  .required(1, '*Organization is required*')
  .option('forked', {
    describe: 'include forked directories'
  })
  .option('token', {
    alias: 't',
    describe: 'oauth token'
  })
  .require('token')
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
  .argv;

var argv = yargs.argv;
var data = [];

var stream = reposForOrg({
  org: options._[0],
  forked: argv.forked,
  token: argv.token,
  keys: argv.keys,
  grep: argv.grep
});

function makeTable(arr, keys) {
  var cols = [];
  var i;
  for (i = 0; i < keys.length; ++i) {
    cols.push(50);
  }
  var table = new Table({
    head: keys,
    colWidths: cols
  });
  for (i = 0; i < arr.length; ++i) {
    var newRow = [];
    for (var j = 0; j < keys.length; ++j) {
      newRow.push(arr[i][keys[j]]);
    }
    table.push(newRow);
  }
  return table;
}

function writeData() {
  var output = '';
  if (argv.format === 'yaml') {
    output = yaml.dump(data);
  } else if (argv.format === 'table') {
    output = makeTable(data, argv.keys).toString();
  } else {
    output = EJSON.stringify(data, null, 2);
  }

  if (argv.out) {
    var dest = fs.createWriteStream(argv.out);
    dest.write(output);
    dest.end();
  } else {
    console.log(output);
  }
}

stream.on('data', function(chunk) {
  data.push(chunk);
});

stream.on('error', function(err) {
  console.error(err.message);
});

stream.on('end', function() {
  writeData();
});
