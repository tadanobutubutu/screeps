const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

app.use(express.json());

const primaryContent = (typeof document !== 'undefined')
  ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content') || document.body)
  : null;

// ... Existing code ...

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

function startApp() {
  loadConfigurations();
  server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

function loadConfigurations() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      config.name = packageJson.name || 'dependency-counter';
      config.version = packageJson.version || '1.0.0';
      config.dependencies = packageJson.dependencies || {};
      config.devDependencies = packageJson.devDependencies || {};
      config.accessibility = packageJson.accessibility || {};
    }
  } catch (error) {
    console.error('Error loading configurations:', error.message);
  }
}

module.exports = {
  config,
  server,
  startApp,
  loadConfigurations
};