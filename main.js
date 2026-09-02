const express = require('express');
const fs = require('fs');
const path = require('path');
const effector = require('effector-sw');
const { initializeApp } = require('./app');
const { generateDependencyReport, utils } = require('./utils');

import './styles.css';

// Add the following imports from the merged commit
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';

const app = express();
const publicPath = path.join(__dirname, 'public');

// Initialize the Screeps bot
const engine = effector.createEngine({
  serviceWorker: path.resolve(__dirname, 'sw.js'),
  clearStorageAfterEachTest: true
});

// Start the Sw Registration and Serve the Public Folder
registerSW(engine);
app.use(express.static(publicPath));

// Handle the main file (main.js) with the compiled code
app.get('/main.js', (req, res) => {
  // Read the main file content
  const fileContent = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

  // Combine the compiled script content with Git conflict markers
  const resolvedFileContent = finalizeResolvedFile(fileContent);

  // Send the compiled main.js file as a response
  res.type('application/javascript');
  res.send(resolvedFileContent);
});

app.get('/dependencies.json', (req, res) => {
  // Read the dependencies file content
  const dependenciesContent = fs.readFileSync(path.join(__dirname, 'dependencies.json'), 'utf8');

  // Send the dependencies file as a response
  res.type('application/json');
  res.send(dependenciesContent);
});

// Start the bot server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // Initialize the app with the language attribute
  initializeAppWithLang();
});

// Helper function to initialize the app with the language attribute
function initializeAppWithLang() {
  const html = document.documentElement;
  const language = getLangAttribute() || getFullLangAttribute();
  if (language) {
    html.setAttribute('lang', language);
  }
}

module.exports = app;