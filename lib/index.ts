#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const program = require('commander');
const { version } = require('../package.json');
const { message } = require('./constants');

program
  .version(version)
  .arguments('<FileName>')
  .description('class to className converter for jsx')
  .usage(`${chalk.green('classname-converte [FileName]')}`)
  .parse(process.argv);

const [FileName] = program.args;

const converteFile = (path: string) => {
  if (!path) {
    return console.log(message.empty);
  }
  fs.readFile(path, 'utf8', (err: Error, data: any) => {
    if (err) {
      return console.log(chalk.red(message.error));
    }

    // Replace class with className
    const result = data.replace(/class=/g, 'className=');

    console.log(chalk.green(message.success));

    fs.writeFile(path, result, 'utf8', (err: Error) => {
      if (err) return console.log(chalk.red(message.error));
    });
  });
};

converteFile(FileName);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
