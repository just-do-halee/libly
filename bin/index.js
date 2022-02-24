#!/usr/bin/env node
'use strict';
const fse = require('fs-extra');
const path = require('path');

const { exec } = require('child_process');

//
const args = process.argv.slice(2);
const [NAME, DEST = process.cwd(), ..._] = args;

const DIR_TEMPLATE = 'template';
const PWD = path.join(__dirname, '..');

//
const errCallback =
  (callback = console.log) =>
  (err, ...rest) => {
    if (err) {
      console.error(err);
    } else {
      callback(...rest);
    }
  };

const src = path.join(PWD, DIR_TEMPLATE);
const dst = path.join(DEST, NAME);

fse.copy(
  src,
  dst,
  { overwrite: true },
  errCallback(() => {
    process.chdir(dst);
    let i = -1;
    const icon = ['-', '\\', '|', '/'];

    process.stderr.write('\u001B[?25l'); // hide cursor

    const tid = setInterval(() => {
      i = ++i % icon.length;
      process.stderr.write(
        `\r \x1b[35m${icon[i]}\x1b[0m \x1b[2minstalling...\x1b[0m`
      );
    }, 400); // spinner

    exec(
      'npm install && git init',
      errCallback(() => {
        clearInterval(tid);
        process.stderr.write(`\r \x1b[1m  success!\x1b[0m     \n`);

        process.stderr.write('\u001B[?25h'); // show cursor
      })
    );
  })
);
