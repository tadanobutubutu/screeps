// main.js

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Import filesystem and path modules
const fs = require('fs');
const path = require('path');

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      updateThScopeAttribute(filePath);
    });
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};