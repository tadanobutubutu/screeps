import React from 'react';
const fs = require('fs');
const path = require('path');

function MyComponent() {
  // Old code that needs to be updated
  return (
    <div lang="en">
      <span id="content">Content</span>
    </div>
  );
}

export default MyComponent;

// Node.js code to read index.html and log its content
const htmlPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(htmlPath, 'utf8');
console.log(content);