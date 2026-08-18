// main.js
const { Worker } = require('worker_threads');
const path = require('path');
const fs = require('fs');

// Existing code from your main.js file
// (Please provide the actual content of your main.js file for me to include here)
// This is just a placeholder for your existing JavaScript code

// Example of how your existing code might look (replace with your actual code):
const constants = require('./src/constants');
const roomManager = require('./src/managers/roomManager');
const spawnManager = require('./src/managers/spawnManager');
const towerManager = require('./src/managers/towerManager');
const builderRole = require('./src/roles/builder');

// ... rest of your existing JavaScript code ...

// The HTML table structure from dependency-graph.html should NOT be in main.js
// It belongs in your React component files, not in the main JavaScript file