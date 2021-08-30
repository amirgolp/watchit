#!/usr/bin/env node

const chokidar = require ('chokidar');
const debounce = require ('lodash.debounce');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');

program
  .version('0.0.1')
  .argument('[filename]', 'name of the file to execute')
  .action(async ({ filename }) => {
    const name = filename || "index.js";

    try {
        await fs.promises.access(name);
    } catch (err) {
        throw new Error(`could not find the file ${name}`);
    }

    const start = debounce(() => {
        spawn('node', [name], { stdio: 'inherit' });
        // console.log('STARTING USERS PROGRAM');
    }, 100);
    
    chokidar.watch('.')
      .on('add', start)
      .on('change', start)
      .on('unlink', start);
    
  });

program.parse(process.argv);


