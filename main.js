const { main } = require('./utilities');
const { functionA, functionB } = require('./functionModule');

const http = require('http');
const url = require('url');

function loop() {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}

function run() {
  const path = require('path');
  const fs = require('fs');
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      updateThScopeAttribute(path.join(viewsDir, file));
    });
}

function updateThScopeAttribute(filePath) {
}

module.exports = {
  loop,
  run,
  a11yStore
};