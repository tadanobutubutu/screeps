// TODO: Import required module(s) and export the new necessary function(s) here in main.js
const fs = require('fs');
const path = require('path');

function helloWorld() {
  return 'Hello, World!';
}

function goodbyeWorld() {
  return 'Goodbye, World!';
}

module.exports = {
  helloWorld,
  goodbyeWorld
};