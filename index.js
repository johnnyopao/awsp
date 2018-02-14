#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');

console.log('AWS Profile Switcher');

const homeDir = process.env['HOME']
const profileRegex = /\[profile .*]/g;
const bracketsRemovalRegx = /(\[profile )|(\])/g;
const clearProfileChoice = '*clear*';

const promptProfileChoice = (data) => {
  const matches = data.match(profileRegex);

  if (!matches) {
    console.log('No profiles found.');
    console.log('Refer to this guide for help on setting up a new AWS profile:');
    console.log('https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html');

    return;
  }

  const profiles = matches.map((match) => {
    return match.replace(bracketsRemovalRegx, '');
  });

  profiles.push(clearProfileChoice);

  const profileChoice = [
    {
      type: 'list',
      name: 'profile',
      message: 'Choose a profile',
      choices: profiles
    }
  ];

  return inquirer.prompt(profileChoice);
}

const readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${homeDir}/.aws/config`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeToConfig = (answers) => {
  const profileChoice =
        answers.profile === clearProfileChoice ? '' : answers.profile;

  return new Promise((resolve, reject) => {
    fs.writeFile(`${homeDir}/.awsp`, profileChoice, { flag: 'w' }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

readConfig()
  .then(promptProfileChoice)
  .then(writeToConfig)
  .catch(error => {
    console.log('Error:', error);
  });
