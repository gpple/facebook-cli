#!/usr/bin/env node

/**
 * Module dependencies.
 */
var program = require('commander'),
    prompt = require('prompt'),
    fs = require('fs'),
    fb = require('./facebook'),
    nconf = require('nconf');

// Config file
// TODO can we use this path? does it refer to the config.json in script folder?
var configFile = 'config.json';

/**
 * Configuration file settings
 */
nconf.file({ file: configFile });

var checkConfigs = function(){
  if (nconf.get('appId')) {
    fb.init(nconf.get('appId'),nconf.get('secret'),nconf.get('token'));
  } else {
    console.log("\nPlease run 'fb config' at first. \n");
    process.exit(1);
  }
};

/**
 * Prompt settings
 */
prompt.message = "";
prompt.delimiter = "";

/**
 * Program
 */
program
  .version('0.0.1');

// Config
program
  .command('config')
  .description('Configure Facebook account details')
  .action(function(){
    var schema = {
      properties: {
        appId: {
          description: "Facebook app ID",
          message: 'appId should be numbers.',
          required: true
        },
        secret: {
          description: "Facebook app secret",
          required: true
        },
        token: {
          description: "Facebook user access token",
          required: true
        }
      }
    };

    // TODO let them know if config object already exists
    console.log("\nPlease enter your facebook account details \n".grey);

    prompt.start();
    prompt.get(schema, function (err, result) {
      // TODO validate via remote call
      nconf.set('appId',result.appId);
      nconf.set('secret',result.secret);
      nconf.set('token',result.token);

      // Save the configuration object
      nconf.save();

      // Init facebook
      checkConfigs();
    });
  });

program
  .command('me')
  .description('Get info about current user')
  .action(function(){
    checkConfigs();

    fb.me();
  });

program
  .command('post <msg>')
  .description('Post status update on your wall')
  .action(function(msg){
    checkConfigs();

    // TODO msg without " quotes
    fb.post(msg);
  });

program
  .parse(process.argv);

// TODO show help if wrong command name given

// Empty call
if (!program.args.length) program.help();