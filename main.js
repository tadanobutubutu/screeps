// Import required module(s) and export the new necessary function(s) here in main.js ( preserving the original code )
const { greeting } = require('./utils');

// TODO: Import required module(s) and export the new necessary function(s) here in main.js ( preserving the original code )

function sayHello(name) {
  return greeting(name);
}

function sayGoodbye(name) {
  return `Goodbye, ${name}!`;
}

function getDate() {
  return new Date().toISOString();
}

module.exports = {
  sayHello,
  sayGoodbye,
  getDate
};