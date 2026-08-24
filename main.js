// You can add your new functions here
function newFunction() {
  // Your code here
}

// --- Do NOT modify any code below this line ---

// Imports
const ScreepsProxyApi = require('proxies/screeps-proxy-api');
const { init } = require('constants/constants');
const Executor = require('executor');
const Game = require('game');

// Main function execution
init(Game, Executor);

module.exports = new ScreepsProxyApi(function () {
  // Your code to be run on the proxy server
});