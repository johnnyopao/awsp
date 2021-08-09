#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");

console.log("AWS Profile Switcher");

const homeDir = process.env["HOME"];
const profileRegex = /\[profile .*]/g;
const bracketsRemovalRegx = /(\[profile )|(\])/g;
const defaultProfileChoice = "default";

const promptProfileChoice = (data) => {
  const matches = data.match(profileRegex);

  if (!matches) {
    console.log("No profiles found.");
    console.log(
      "Refer to this guide for help on setting up a new AWS profile:"
    );
    console.log(
      "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html"
    );

    return;
  }

  const profiles = matches.map((match) => {
    return match.replace(bracketsRemovalRegx, "");
  });

  profiles.push(defaultProfileChoice);

  const profileChoice = [
    {
      type: "list",
      name: "profile",
      message: "Choose a profile",
      choices: profiles,
      default: process.env.AWS_PROFILE || defaultProfileChoice,
    },
  ];

  return inquirer.prompt(profileChoice);
};

const readAwsProfiles = () => {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(`${homeDir}/.aws/config`)) {
        console.log("Found .aws directory.");
        fs.readFile(`${homeDir}/.aws/config`, "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } else if ("AWS_CONFIG_FILE" in process.env) {
        if (fs.statSync(process.env["AWS_CONFIG_FILE"]).isFile()) {
          fs.readFile(process.env["AWS_CONFIG_FILE"], "utf8", (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        } else {
          console.log("AWS_CONFIG_FILE environment variable not set properly!");
        }
      } else {
        console.log("Cannot find .aws/config or AWS_CONFIG_FILE env variable!");
      }
    } catch (e) {
      console.log("An error occurred.");
    }
  });
};

const writeToConfig = (answers) => {
  const profileChoice =
    answers.profile === defaultProfileChoice ? "" : answers.profile;

  return new Promise((resolve, reject) => {
    fs.writeFile(
      `${homeDir}/.awsp`,
      profileChoice,
      { flag: "w" },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

readAwsProfiles()
  .then(promptProfileChoice)
  .then(writeToConfig)
  .catch((error) => {
    console.log("Error:", error);
    process.exit(1);
  });
