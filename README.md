# AWSPS - AWS Profile Switcher

Setup and configuration is pretty hacky right now. Need to find a more elegant way of doing this.

Current setup:
1. clone awsp proj
1. npm install
1. add a bash function to shell config to call awsp

```sh
awsp () {
  source $HOME/dotfiles/awsp/run.sh
}
```