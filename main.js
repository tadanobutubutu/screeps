// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

// Import required modules
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Utility functions
function getFileExtension(filepath) {
  return path.extname(filepath);
}

function readFileAsync(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function writeFileAsync(filepath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function createServer(port, hostname, requestListener) {
  const server = http.createServer(requestListener);
  return server.listen(port, hostname);
}

function createHttpsServer(options, requestListener) {
  const server = https.createServer(options, requestListener);
  return server;
}

function getAbsolutePath(relativePath) {
  return path.resolve(relativePath);
}

function joinPaths(...paths) {
  return path.join(...paths);
}

// Export functions
module.exports = {
  fs,
  path,
  http,
  https,
  getFileExtension,
  readFileAsync,
  writeFileAsync,
  createServer,
  createHttpsServer,
  getAbsolutePath,
  joinPaths
};